using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using BoxR.Web.Models;

namespace BoxR.Web.Controllers
{
    public class HomeController : Controller
    {
        [Authorize]
        public ActionResult Index()
        {
            ViewBag.Message = "Modify this template to jump-start your ASP.NET MVC application.";

            return View();
        }

        public ActionResult StartGame(string name,string opponent,bool selfstart,double cwidth)
        {
            var model = new GameModel
                            {
                                Name = selfstart ? name : opponent,
                                OpponentName = selfstart ? opponent : name,
                                SelfStart = selfstart,
                                CanvasWidth = cwidth
                            };
            return View(model);
        }
    }
}