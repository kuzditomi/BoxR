using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BoxR.Web.Models
{
    public class GameModel
    {
        public string Name { get; set; }
        public string OpponentName { get; set; }
        public bool SelfStart { get; set; }
        public double CanvasWidth { get; set; }
    }
}