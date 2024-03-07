using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebShopping.Models
{
    public class NewsImage
    {
        public Guid Id { get; set; }

        public string Image_Name { get; set; }

        public Guid News_Id { get; set; }

        public DateTime Created_Date { get; set; }
    }
}