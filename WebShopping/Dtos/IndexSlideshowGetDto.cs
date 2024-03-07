using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebShopping.Dtos
{
    public class IndexSlideshowGetDto : Models.IndexSlideshow
    {
        //public Guid Id { get; set; }

        //public string File_Name { get; set; }

        //public string Image_Url { get; set; }

        //public string Image_Link { get; set; }
      
        //public string First { get; set; }

        public new string Creation_Date { get; set; }
    }
}