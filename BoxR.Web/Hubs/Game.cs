using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Security;
using System.Net;
using BoxR.Web.Managers;
using Facebook;
using Microsoft.AspNet.SignalR;
using BoxR.Web.Models;
using Microsoft.Web.WebPages.OAuth;
using Newtonsoft.Json;
using WebMatrix.WebData;

namespace BoxR.Web.Hubs
{
    public class Game : Hub
    {
        private static readonly log4net.ILog Logger = log4net.LogManager.GetLogger("game");

        #region Connect and Disconnect
        /// <summary>
        /// A client has started connection
        /// </summary>
        /// <returns></returns>
        public override Task OnConnected()
        {
            Logger.Info("New connection, id:" + Context.ConnectionId);
            
            var username = Context.User.Identity.Name; // Get the logged in username
            var context = new UsersContext();
            var profile = context // Find the userprofile by the username(is it uniqe?)
                .UserProfiles
                .SingleOrDefault(up => up.UserName == username);

            if(profile != null && !UserManager.IsUserLoggedIn(profile.UserName)) // If the userprofile exists, and the user is not logged in with other windows/browser
            {
                Logger.Info(String.Format("Logged in, connectionid:{0}, username:{1}",Context.ConnectionId,profile.UserName));

                //Clients.Caller.receiveUsers(UserManager.GetUsers()); // Send the client the users currently logged in TODO: and not in game(or currently invited?)

                profile.ConnectionId = Context.ConnectionId; // Store the connectionid in the userprofile (not mapped) for performance
                UserManager.AddUser(Context.ConnectionId, profile); // Add the user to the static userlist
                
                Clients.Others.receiveUser(profile); // Alert the other clients about the new user
            }
            else if(profile != null)
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
            Logger.Info("Disconnected, id:" + Context.ConnectionId);

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
        #endregion

        #region Invite
        /// <summary>
        /// Send invite to another user
        /// </summary>
        /// <param name="invited">connection id of the other user</param>
        public void Invite(string invited)
        {
            if (!Authenticate() || !Authenticate(invited)) // Check the connection ids : no simultaneous game sorry :( 
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
            if (!Authenticate()) // It's never too late to check 
                return;
            
            var user = UserManager.GetUser(Context.ConnectionId); // Get the current user
            
            if (!user.IsInGroup) // If something went wrong between the invite and the accept
                return;
            
            var opponent = UserManager.GetOtherUserInGroup(Context.ConnectionId, user.GroupId); // Get the inviter's profile

            Clients.Caller.startGame(true, user.UserName, opponent.UserName); // The invited start the game. This user puts first
            Clients.Client(opponent.ConnectionId).startGame(false, opponent.UserName, user.UserName); // The inviter also starts the game

            Clients.AllExcept(new[] {Context.ConnectionId,opponent.ConnectionId}).removeUser(Context.ConnectionId);
            Clients.AllExcept(new[] {Context.ConnectionId,opponent.ConnectionId}).removeUser(opponent.ConnectionId);
        }

        /// <summary>
        /// Stop the current invite.
        /// Can be called from both client, since they are (hopefully) in a group by now.
        /// </summary>
        public void InviteDenied()
        {
            if(!Authenticate()) // Check for duplicate, or bad connection
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
        #endregion

        #region Game actions
        /// <summary>
        /// Client has clicked to an edge in game
        /// </summary>
        /// <param name="i">Row count of the edge</param>
        /// <param name="j">Column count if the edge</param>
        public void EdgeClicked(int i, int j)
        {
            if (!Authenticate()) 
                return;

            var user = UserManager.GetUser(Context.ConnectionId);
            Clients.OthersInGroup(user.GroupId).edgeClicked(i, j); // pass the click to the opponent    
        }

        /// <summary>
        /// Returns the list of current users
        /// </summary>
        public void GetUsers()
        {
            Clients.Caller.receiveUsers(UserManager.GetUsers());
        }

        /// <summary>
        /// Removes the users from group, adding them available in the main screen
        /// TODO: store the results
        /// </summary>
        public void FinishGame()
        {
            if (!Authenticate()) // It's never too late to check 
                return;

            var user = UserManager.GetUser(Context.ConnectionId); // Get the current user

            if (!user.IsInGroup) // If something went wrong between the invite and the accept
                return;

            var opponent = UserManager.GetOtherUserInGroup(Context.ConnectionId, user.GroupId); // Get the inviter's profile

            UserManager.RemoveUserFromGroup(Context.ConnectionId);
            UserManager.RemoveUserFromGroup(opponent.ConnectionId);
            Clients.Others.receiveUser(opponent);
            Clients.AllExcept(opponent.ConnectionId).receiveUser(user);
        }

        public void QuitGame()
        {
            if (!Authenticate()) // It's never too late to check 
                return;

            var user = UserManager.GetUser(Context.ConnectionId); // Get the current user

            if (!user.IsInGroup) // If something went wrong
                return;

            var opponent = UserManager.GetOtherUserInGroup(Context.ConnectionId, user.GroupId); // Get the inviter's profile

            Groups.Remove(user.ConnectionId, user.GroupId); // remove from SignalR group
            Groups.Remove(opponent.ConnectionId, user.GroupId);

            UserManager.RemoveUserFromGroup(Context.ConnectionId); // remove from local group
            UserManager.RemoveUserFromGroup(opponent.ConnectionId);
            
            Clients.Client(opponent.ConnectionId).alertDisconnect(); // Alert the opponent about the disconnect :(
            Clients.Others.receiveUser(opponent);
            Clients.AllExcept(opponent.ConnectionId).receiveUser(user);
        }

        #endregion

        #region Helpers

        /// <summary>
        /// Checks if the user is added to the custom userlist 
        /// </summary>
        /// <param name="connectionId">Connection id of the current request</param>
        /// <returns>true if the user is added to the userlist, else false</returns>
        private bool Authenticate(string connectionId)
        {
            if (UserManager.UserExists(connectionId))
                return true;

            Clients.Caller.NotAuthenticated();
            return false;
        }

        /// <summary>
        /// Checks if the current user is added to the custom userlist 
        /// </summary>
        /// <returns>true if the user is added to the userlist, else false</returns>
        private bool Authenticate()
        {
            return Authenticate(Context.ConnectionId);
        }
        #endregion

        #region Login,Logout
        public string Login(string username,string password)
        {
            if(UserManager.UserExists(Context.ConnectionId))
                UserManager.RemoveUser(Context.ConnectionId);
            try
            {
                if (!WebSecurity.Initialized)
                {
                    WebSecurity.InitializeDatabaseConnection("DefaultConnection", "UserProfile", "UserId", "UserName", autoCreateTables: true);
                }
                if (Membership.ValidateUser(username,password))
                {
                    using (var db = new UsersContext())
                    {
                        var profile = db.UserProfiles.SingleOrDefault(u => u.UserName == username);
                        if (profile != null && !UserManager.IsUserLoggedIn(profile.UserName)) // If the userprofile exists, and the user is not logged in with other windows/browser
                        {
                            Logger.Info(String.Format("Logged in, connectionid:{0}, username:{1}", Context.ConnectionId, profile.UserName));

                            //Clients.Caller.receiveUsers(UserManager.GetUsers()); // Send the client the users currently logged in TODO: and not in game(or currently invited?)

                            profile.ConnectionId = Context.ConnectionId; // Store the connectionid in the userprofile (not mapped) for performance
                            UserManager.AddUser(Context.ConnectionId, profile); // Add the user to the static userlist

                            Clients.Others.receiveUser(profile); // Alert the other clients about the new user

                            return profile.UserName;
                        }
                        else
                        {
                            Clients.Caller.alertDuplicate(); // Alert the client about his fail
                            Logger.Error("Duplication login try from "+ profile.UserId+ ": " + profile.UserName);
                        }
                    }
                }
            }
            catch(Exception e)
            {
                Logger.Error(e.Message,e);
            }
            return string.Empty;
        }

        public LoginResponse LoginExternal(string provider, string token)
        {
            // If the user is already logged in, remove him from the users
            // then refresh the authentication
            if(Authenticate(Context.ConnectionId))
            {
                var user = UserManager.GetUser(Context.ConnectionId);
                if (user.IsInGroup)
                {
                    Clients.OthersInGroup(user.GroupId).quitGame();

                    Groups.Remove(Context.ConnectionId, user.GroupId); // Remove user from the SignalR group

                    var otherUserinGroup = UserManager.GetOtherUserInGroup(Context.ConnectionId, user.GroupId); // Find the opponent user
                    if (otherUserinGroup != null)
                    {
                        Groups.Remove(otherUserinGroup.ConnectionId, otherUserinGroup.GroupId); // Remove opponent from signalR group
                        UserManager.RemoveUserFromGroup(otherUserinGroup.ConnectionId); // Remove opponent's group

                        Clients.Client(otherUserinGroup.ConnectionId).alertDisconnect(); // Alert the opponent about the disconnect :(
                    }
                }
                UserManager.RemoveUser(Context.ConnectionId);
            }
            switch (provider)
            {
                case "facebook":
                    return FacebookLogin(token);
                case "microsoft":
                    return LiveLogin(token);
            }
            return new LoginResponse { Result = ResponseType.Error };
        }
        
        public string RegisterUserNameToOAuth(string newUserName)
        {
            var pendingUser = UserManager.GetPendingUser(Context.ConnectionId);
            if(pendingUser != null)
            {
                using (var db = new UsersContext())
                {
                    var profile = new UserProfile
                    {
                        UserName = newUserName
                    };
                    db.UserProfiles.Add(profile);
                    db.SaveChanges();

                    OAuthWebSecurity.CreateOrUpdateAccount(pendingUser.Provider, pendingUser.UserId, newUserName);

                    Logger.Info(String.Format("{0} registered, and logged in, connectionid:{1}, username:{2}", pendingUser.Provider,
                                              Context.ConnectionId, profile.UserName));

                    //Clients.Caller.receiveUsers(UserManager.GetUsers()); // Send the client the users currently logged in TODO: and not in game(or currently invited?)

                    profile.ConnectionId = Context.ConnectionId;
                    // Store the connectionid in the userprofile (not mapped) for performance
                    UserManager.AddUser(Context.ConnectionId, profile); // Add the user to the static userlist

                    Clients.Others.receiveUser(profile); // Alert the other clients about the new user
                    return profile.UserName;
                }
            }
            return string.Empty; // TODO: error handling
        }

        public void SkipRegistration()
        {
            UserManager.RemovePendingUserFromQueue(Context.ConnectionId);
        }

        public void Logout()
        {
            if (Authenticate(Context.ConnectionId))
            {
                var user = UserManager.GetUser(Context.ConnectionId);
                if (user.IsInGroup)
                {
                    Clients.OthersInGroup(user.GroupId).quitGame();

                    Groups.Remove(Context.ConnectionId, user.GroupId); // Remove user from the SignalR group

                    var otherUserinGroup = UserManager.GetOtherUserInGroup(Context.ConnectionId, user.GroupId); // Find the opponent user
                    if (otherUserinGroup != null)
                    {
                        Groups.Remove(otherUserinGroup.ConnectionId, otherUserinGroup.GroupId); // Remove opponent from signalR group
                        UserManager.RemoveUserFromGroup(otherUserinGroup.ConnectionId); // Remove opponent's group

                        Clients.Client(otherUserinGroup.ConnectionId).alertDisconnect(); // Alert the opponent about the disconnect :(
                    }
                }
                UserManager.RemoveUser(Context.ConnectionId);
                WebSecurity.Logout();
            }
        }

        
        #region Login helpers
        private LoginResponse FacebookLogin(string token)
        {
            var client = new FacebookClient(token);
            try
            {
                dynamic fbresult = client.Get("me");
                FacebookUserModel fbuser = Newtonsoft.Json.JsonConvert.DeserializeObject<FacebookUserModel>(fbresult.ToString());

                return LoginOrCreateOAuthUser("facebook", fbuser.id, fbuser.username);
            }
            catch (Exception e)
            {
                Logger.Error(e.Message, e);
            }
            return new LoginResponse { Result = ResponseType.Error };
        }

        private LoginResponse LiveLogin(string token)
        {
            var uri = String.Format("https://apis.live.net/v5.0/me/?access_token={0}", token);
            var webClient = new WebClient();
            var respose = webClient.DownloadString(uri);

            var user = JsonConvert.DeserializeObject<LiveUser>(respose);
            return LoginOrCreateOAuthUser("microsoft", user.Id, user.Name);
        }

        private LoginResponse LoginOrCreateOAuthUser(string provider, string userId, string userName)
        {
            using (var db = new UsersContext())
            {
                if (!WebSecurity.Initialized)
                {
                    WebSecurity.InitializeDatabaseConnection("DefaultConnection", "UserProfile", "UserId", "UserName", autoCreateTables: true);
                }
                var oauthuser = OAuthWebSecurity.GetUserName(provider, userId);
                if (!String.IsNullOrEmpty(oauthuser))
                {
                    UserProfile profile = db.UserProfiles.FirstOrDefault(u => u.UserName.ToLower() == oauthuser.ToLower());
                    if (profile != null && !UserManager.IsUserLoggedIn(profile.UserName)) // If the userprofile exists, and the user is not logged in with other windows/browser
                    {
                        Logger.Info(String.Format("Logged in, connectionid:{0}, username:{1}", Context.ConnectionId, profile.UserName));

                        //Clients.Caller.receiveUsers(UserManager.GetUsers()); // Send the client the users currently logged in TODO: and not in game(or currently invited?)

                        profile.ConnectionId = Context.ConnectionId; // Store the connectionid in the userprofile (not mapped) for performance
                        UserManager.AddUser(Context.ConnectionId, profile); // Add the user to the static userlist

                        Clients.Others.receiveUser(profile); // Alert the other clients about the new user
                        return new LoginResponse { Result = ResponseType.Success, UserName = profile.UserName };
                    }
                    if (profile != null)
                    {
                        Logger.Error("Duplication login try from " + profile.UserId + ": " + profile.UserName);
                        Clients.Caller.alertDuplicate(); // Alert the client about his fail
                        return new LoginResponse { Result = ResponseType.Error };
                    }
                    else
                    {
                        Logger.Error(String.Format("Inconsistend database state, oauth {0} exists but no UserProfile.", oauthuser));
                        return new LoginResponse { Result = ResponseType.Error };
                    }
                }
                else
                {
                    var pendingUser = new PendingUser
                                          {
                                              Provider = provider,
                                              UserName = userName,
                                              UserId = userId
                                          };
                    UserManager.AddUserToRegisterQueue(Context.ConnectionId, pendingUser);
                    return new LoginResponse { Result = ResponseType.ChooseNick };
                }
            }
        }
        #endregion

        #endregion

        #region Test
        public void Test(string token)
        {
            if (UserManager.UserExists(Context.ConnectionId))
                Clients.Caller.receive("már beléptél");
            else
            {
                var client = new FacebookClient(token);
                try
                {
                    dynamic fbresult = client.Get("me");
                    FacebookUserModel fbuser = Newtonsoft.Json.JsonConvert.DeserializeObject<FacebookUserModel>(fbresult.ToString());
                    
                    using (var db = new UsersContext())
                    {
                        if(!WebSecurity.Initialized)
                        {
                            WebSecurity.InitializeDatabaseConnection("DefaultConnection", "UserProfile", "UserId", "UserName", autoCreateTables: true);
                        }
                        var oauthuser = OAuthWebSecurity.GetUserName("facebook", fbuser.id);
                        if (!String.IsNullOrEmpty(oauthuser))
                        {
                            UserProfile user = db.UserProfiles.FirstOrDefault(u => u.UserName.ToLower() == oauthuser.ToLower());
                            UserManager.AddUser(Context.ConnectionId, user);
                            Clients.Caller.receive("sikeres belépés");
                        }
                        else
                        {
                            // Insert name into the profile table
                            var user = new UserProfile
                                        {
                                            UserName = fbuser.username
                                        };
                            db.UserProfiles.Add(user);
                            db.SaveChanges();

                            OAuthWebSecurity.CreateOrUpdateAccount("facebook", fbuser.id, fbuser.username);

                            UserManager.AddUser(Context.ConnectionId, user);
                            Clients.Caller.receive("új account létrehozva");
                        }
                    }
                }
                catch (Exception e)
                {
                    Logger.Error(e.Message, e);
                    Clients.Caller.receive("hiba:" + e.Message);
                }
            }
        }
        #endregion

        #region Membership initialize

        private class SimpleMembershipInitializer
        {
            public SimpleMembershipInitializer()
            {
                Database.SetInitializer<UsersContext>(null);

                try
                {
                    using (var context = new UsersContext())
                    {
                        if (!context.Database.Exists())
                        {
                            // Create the SimpleMembership database without Entity Framework migration schema
                            ((IObjectContextAdapter)context).ObjectContext.CreateDatabase();
                        }
                    }

                    WebSecurity.InitializeDatabaseConnection("DefaultConnection", "UserProfile", "UserId", "UserName", autoCreateTables: true);
                }
                catch (Exception ex)
                {
                    throw new InvalidOperationException("The ASP.NET Simple Membership database could not be initialized. For more information, please see http://go.microsoft.com/fwlink/?LinkId=256588", ex);
                }
            }
        }
        #endregion
    }
}