using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebShopping.Dtos
{
    public class Knowledge_content_Dto
    {
        public Guid id { get; set; }
        public string image_name { get; set; }
        public string title { get; set; }
        public string brief { get; set; }
        public string content { get; set; }
        public string creation_date { get; set; }
        public byte Enabled { get; set; }
        public int Sort { get; set; }
        public string First { get; set; }
    }
}