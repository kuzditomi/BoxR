using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Security;
using System.Net;
using BoxR.Managers;
using Microsoft.AspNet.SignalR;
using BoxR.Models;
using System.Diagnostics;

namespace BoxR.Hubs
{
    public class Game : Hub
    {
        // TODO: log

        /// <summary>
        /// A client has started connection
        /// </summary>
        /// <returns></returns>
        public override Task OnConnected()
        {
            var username = Context.User.Identity.Name; // Get the logged in username
            var context = new UsersContext();
            var profile = context // Find the userprofile by the username(is it uniqe?)
                .UserProfiles
                .SingleOrDefault(up => up.UserName == username);

            if(profile != null && !UserManager.IsUserLoggedIn(profile.UserName)) // If the userprofile exists, and the user is not logged in with other windows/browser
            {
                Clients.Caller.receiveUsers(UserManager.GetUsers()); // Send the client the users currently logged in TODO: and not in game(or currently invited?)

                profile.ConnectionId = Context.ConnectionId; // Store the connectionid in the userprofile (not mapped) for performance
                UserManager.AddUser(Context.ConnectionId, profile); // Add the user to the static userlist
                
                Clients.Others.receiveUser(profile, Context.ConnectionId); // Alert the other clients about the new user
            }
            else
            {
                Clients.Caller.alertDuplicate(); // Alert the client about his fail
            }
            return base.OnConnected();
        }

        /// <summary>
        /// A client has disconnected
        /// </summary>
        /// <returns></returns>
        public override Task OnDisconnected()
        {
            if (UserManager.UserExists(Context.ConnectionId)) // If the user is on the users' list ( is not duplicate, or any error)
            {
                var user = UserManager.GetUser(Context.ConnectionId); // Get the profile of the user
                
                if (user.IsInGroup) // If the user is already part of a group
                {    
                    Groups.Remove(Context.ConnectionId, user.GroupId); // Remove user from the SignalR group
                    
                    var otherUserinGroup = UserManager.GetOtherUserInGroup(Context.ConnectionId, user.GroupId); // Find the opponent user
                    if(otherUserinGroup != null) 
                    {
                        Groups.Remove(otherUserinGroup.ConnectionId, otherUserinGroup.GroupId); // Remove opponent from signalR group
                        UserManager.RemoveUserFromGroup(otherUserinGroup.ConnectionId); // Remove opponent's group

                        Clients.Client(otherUserinGroup.ConnectionId).alertDisconnect(); // Alert the opponent about the disconnect :(
                    }
                }

                UserManager.RemoveUser(Context.ConnectionId); // Remove the user from the own list too

                Clients.Others.removeUser(Context.ConnectionId); // Alert other users to remove this from their list
            }

            return base.OnDisconnected();
        }

        /// <summary>
        /// Send invite to another user
        /// </summary>
        /// <param name="invited">connection id of the other user</param>
        public void Invite(string invited)
        {
            if (!UserManager.UserExists(invited) || !UserManager.UserExists(Context.ConnectionId)) // Check the connection ids : no simultaneous game sorry :( 
                 return;
           
            var invitedUser = UserManager.GetUser(invited); // Get the other user's profile
            var currentUser = UserManager.GetUser(Context.ConnectionId); // Get the current userprofile
            
            if(invitedUser.IsInGroup || currentUser.IsInGroup) // Check if the other user is already in a group (invited by other user or is in game) plus selfcheck because why not?
                return;
           
            var groupName = Guid.NewGuid().ToString(); // Generate groupname

            if (!UserManager.AddUserToGroup(Context.ConnectionId, groupName) || !UserManager.AddUserToGroup(invited, groupName)) // Try to add both players to group
            {
                UserManager.RemoveUserFromGroup(Context.ConnectionId); // in case of any error while adding both of them to group
                UserManager.RemoveUserFromGroup(invited); // remove both of them
            }
            
            Groups.Add(Context.ConnectionId, groupName); // Add the user to a SignalR group
            Groups.Add(invited, groupName); // Add the user to the same SignalR group

            Clients.Caller.waitInvite(invitedUser.UserName); // Pop up the "You have invited XYZ, please wait..." window
            Clients.Client(invited).invited(currentUser); // Finally... invite the other user
        }

        /// <summary>
        /// The user accepted to invite.
        /// </summary>
        public void InviteAccepted()
        {
            if (!UserManager.UserExists(Context.ConnectionId)) // It's never too late to check 
                return;
            
            var user = UserManager.GetUser(Context.ConnectionId); // Get the current user
            
            if (!user.IsInGroup) // If something went wrong between the invite and the accept
                return;
            
            var opponent = UserManager.GetOtherUserInGroup(Context.ConnectionId, user.GroupId); // Get the inviter's profile

            Clients.Caller.startGame(true, user.UserName, opponent.UserName); // The invited start the game. This user puts first
            Clients.Client(opponent.ConnectionId).startGame(false, user.UserName, opponent.UserName); // The inviter also starts the game
        }

        /// <summary>
        /// Stop the current invite.
        /// Can be called from both client, since they are (hopefully) in a group by now.
        /// </summary>
        public void InviteDenied()
        {
            if(!UserManager.UserExists(Context.ConnectionId)) // Check for duplicate, or bad connection
                return;

            var user = UserManager.GetUser(Context.ConnectionId); // Get the current user
            if (!user.IsInGroup) // Okay, this could also happen... somehow...
            {
                Clients.Caller.inviteDenied(); // Alert the client
                return;
            }

            var opponent = UserManager.GetOtherUserInGroup(Context.ConnectionId,user.GroupId); // Get the other user

            if(opponent != null) // Safety check
            {
                Groups.Remove(opponent.ConnectionId, user.GroupId); // Remove opponent from SignalR group
                UserManager.RemoveUserFromGroup(opponent.ConnectionId); // Remove opponents group from profile
                Clients.Client(opponent.ConnectionId).inviteDenied(); // Alert the opponent about the deny
            }

            Groups.Remove(Context.ConnectionId, user.GroupId); // Remove user from SignalR group
            UserManager.RemoveUserFromGroup(Context.ConnectionId); // Remove group from profile
            Clients.Caller.inviteDenied(); // Alert the client about the deny TODO: It's for the script, should be removed and close popup on client side.
        }

        /// <summary>
        /// Client has clicked to an edge in game
        /// </summary>
        /// <param name="i">Row count of the edge</param>
        /// <param name="j">Column count if the edge</param>
        public void EdgeClicked(int i, int j)
        {
            if (!UserManager.UserExists(Context.ConnectionId)) 
                return;

            var user = UserManager.GetUser(Context.ConnectionId);
            Clients.OthersInGroup(user.GroupId).edgeClicked(i, j); // pass the click to the opponent    
        }
    }
}