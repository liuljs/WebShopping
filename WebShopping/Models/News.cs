using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebShopping.Models
{
    public class News
    {
        public Guid Id { get; set; }

        public string Title { get; set; }

        public string Contents { get; set; }

        public string Image_Name { get; set; }

        public string First { get; set; }

        public DateTime Created_Date { get; set; }

        public DateTime Updated_Date { get; set; }

        //public int No { get; set; }      
        public byte Enabled { get; set; }
        public DateTime Start_Date { get; set; }
        public DateTime End_Date { get; set; }
    }
}