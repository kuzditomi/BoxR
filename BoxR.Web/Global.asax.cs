using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using BoxR.Web.Models;
using Microsoft.AspNet.SignalR;
using WebMatrix.WebData;

namespace BoxR.Web
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        private static log4net.ILog BoxRLogger; 

        protected void Application_Start()
        {
            //Database.SetInitializer<BoxR.Web.Models.UsersContext>(new CreateDatabaseIfNotExists<UsersContext>());
            log4net.Config.XmlConfigurator.Configure();
            BoxRLogger = log4net.LogManager.GetLogger("LogFileAppender");
            RouteTable.Routes.MapHubs(new HubConfiguration
                                          {
                                              EnableCrossDomain = true
                                          });
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            AuthConfig.RegisterAuth();

            WebSecurity.InitializeDatabaseConnection("DefaultConnection", "UserProfile", "UserId", "UserName", autoCreateTables: true);
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            BoxRLogger.Error(Server.GetLastError().Message);
        }
    }
}