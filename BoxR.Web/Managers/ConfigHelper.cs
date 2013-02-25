using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace BoxR.Web.Managers
{
    public static class ConfigHelper
    {
        public static string WebsiteAddress
        {
            get { return ConfigurationManager.AppSettings["webaddress"]; }
        }
        public static string FacebookAppId
        {
            get { return ConfigurationManager.AppSettings["fbappid"]; }
        }
        public static string FacebookAppSecret
        {
            get { return ConfigurationManager.AppSettings["fbappsecret"]; }
        }
        public static string MicrosoftAppId
        {
            get { return ConfigurationManager.AppSettings["msappid"]; }
        }
        public static string MicrosoftAppSecret
        {
            get { return ConfigurationManager.AppSettings["msappsecret"]; }
        }
    }
}