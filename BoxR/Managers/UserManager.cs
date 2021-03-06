﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BoxR.Models;

namespace BoxR.Managers
{
    public static class UserManager
    {
        #region Properties

        private static Dictionary<string, UserProfile> _users;

        private static Dictionary<string, UserProfile> Users
        {
            get { return _users ?? (_users = new Dictionary<string, UserProfile>()); }
        }

        private static Dictionary<string, Group> _groups; 
        private static Dictionary<string, Group> Groups
        {
            get { return _groups ?? (_groups = new Dictionary<string, Group>()); }
        } 
        #endregion

        #region User handling

        public static bool UserExists(string key)
        {
            return Users.ContainsKey(key);
        }

        public static void AddUser(string connectionId, UserProfile userProfile)
        {
            Users.Add(connectionId, userProfile);
        }

        public static UserProfile GetUser(string connectionId)
        {
            return Users.ContainsKey(connectionId) ? Users[connectionId] : null;
        }

        public static Dictionary<string, UserProfile> GetUsers()
        {
            // is it deep copy? should be
            return new Dictionary<string, UserProfile>(Users);
        }

        public static void RemoveUser(string connectionId)
        {
            Users.Remove(connectionId);
        }

        public static bool IsUserLoggedIn(string userName)
        {
            return Users.Values.Any(u => u.UserName == userName);
        }

        #endregion

        #region Group handling
        public static bool AddUserToGroup(string connectionId,string groupName)
        {
            var user = Users[connectionId];
            if (user == null || user.IsInGroup)
                return false;

            user.GroupId = groupName;
            return true;
        }
        public static void RemoveUserFromGroup(string connectionId)
        {
            var user = Users[connectionId];
            if(user != null && user.IsInGroup)
            {
                user.GroupId = string.Empty;
            }
        }
        public static UserProfile GetOtherUserInGroup(string selfConnectionId,string groupName)
        {
            return Users
                .Where(u => u.Value.GroupId == groupName && u.Key != selfConnectionId)
                .Select(u => u.Value)
                .FirstOrDefault();
        }
        #endregion
    }
}