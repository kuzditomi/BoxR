using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BoxR.Web.Models
{
    public class PendingUser
    {
        public string Provider { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
    }
}