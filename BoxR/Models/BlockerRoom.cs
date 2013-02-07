using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BoxR.Models
{
    public class Room
    {
        public string Name { get; set; }

        public UserProfile UserOne { get; set; }

        public UserProfile UserTwo { get; set; }
        
        /// <summary>
        /// 0 - UserOne's turn, 1 - UserTwo's turn
        /// </summary>
        private short _turn = 0;

        public int NextTurn()
        {
            if (_turn == 0)
                return _turn = 1;
            else
                return _turn = 0;
        }
    }
}