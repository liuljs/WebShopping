using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace WebShopping.Models
{
    public class IndexSlideshow
    {       
        public Guid Id { get; set; }

        public string File_Name { get; set; }

        public string Image_Url { get; set; }

        public string Image_Link { get; set; }
        
        [StringLength(1)]       
        public string First { get; set; }

        public DateTime Creation_Date { get; set; }       
    }

}