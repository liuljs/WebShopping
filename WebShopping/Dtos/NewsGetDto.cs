using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebShopping.Dtos
{
    public class NewsGetDto
    {
        private string start_Date = string.Empty;
        private string end_Date = string.Empty;

        public Guid Id { get; set; }

        public string Title { get; set; }

        public string Contents { get; set; }

        public string Image_Url { get; set; }

        public string First { get; set; }

        public string Date { get; set; }
        public byte Enabled { get; set; }
        public string Start_Date { get { return start_Date; } set { start_Date = value; } }
        public string End_Date { get { return end_Date; } set { end_Date = value; } }
    }
}