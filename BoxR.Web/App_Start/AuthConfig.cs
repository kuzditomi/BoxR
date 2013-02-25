using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BoxR.Web.Managers;
using Microsoft.Web.WebPages.OAuth;
using BoxR.Web.Models;

namespace BoxR.Web
{
    public static class AuthConfig
    {
        public static void RegisterAuth()
        {
            // To let users of this site log in using their accounts from other sites such as Microsoft, Facebook, and Twitter,
            // you must update this site. For more information visit http://go.microsoft.com/fwlink/?LinkID=252166

            OAuthWebSecurity.RegisterMicrosoftClient(
                clientId: ConfigHelper.MicrosoftAppId,
                clientSecret: ConfigHelper.MicrosoftAppSecret);

            //OAuthWebSecurity.RegisterTwitterClient(
            //    consumerKey: "",
            //    consumerSecret: "");

            OAuthWebSecurity.RegisterFacebookClient(
                appId: ConfigHelper.FacebookAppId,
                appSecret: ConfigHelper.FacebookAppSecret);

            //OAuthWebSecurity.RegisterGoogleClient();
        }
    }
}
