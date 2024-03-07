using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebShopping.Dtos
{
    public class IndexSlideshowInsertDto
    {
        public Guid Id { get; set; }

        public string File_Name { get; set; }

        public string Date { get; set; }
    }
}