using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BoxR.Web.Models
{
    public enum ResponseType
    {
        Success = 0,
        ChooseNick = 1,
        Error = 2
    }

    public class LoginResponse
    {
        public ResponseType Result { get; set; }
        public string UserName { get; set; }
    }
}