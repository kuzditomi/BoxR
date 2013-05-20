using System.Web;
using System.Web.Optimization;

namespace BoxR.Web
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/login").Include("~/js/login.js"));
            bundles.Add(new ScriptBundle("~/bundles/init").Include("~/js/lib/jquery-1.9.1.js", "~/js/BoxR.InitBackground.js"));
            bundles.Add(new ScriptBundle("~/bundles/game").Include("~/signalr/hubs", "~/js/lib/jquery.signalR-1.0.1.js", "~/js/BoxR.Server.js", "~/js/BoxR.IClient.js", "~/js/BoxR.WebClient.js", "~/js/BoxR.Game.js", "~/js/BoxR.Manager.js","~/js/BoxR.Popup.js"));
            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/Site.css"));

            bundles.Add(new StyleBundle("~/Content/login").Include("~/Content/Login.css"));
            bundles.Add(new StyleBundle("~/Content/error").Include("~/Content/Error.css"));

            bundles.Add(new StyleBundle("~/Content/bootstrap").Include("~/Content/metro-bootstrap.css","~/Content/boxr.css"));
        }
    }
}