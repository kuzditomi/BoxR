using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BoxR.Models
{
    public class Group
    {
        public string Name { get; set; }

        private List<string> _connectionIds;
        public List<string> ConnectionIds
        {
            get { return _connectionIds ?? (_connectionIds = new List<string>()); }
        }

        public Group(string name)
        {
            Name = name;
        }
    }
}