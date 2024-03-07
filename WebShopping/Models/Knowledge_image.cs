using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebShopping.Models
{
    public class Knowledge_image
    {
        public Guid id { get; set; }

        [StringLength(50)]
        public string image_name { get; set; }
        public Guid? Knowledge_content_id { get; set; }
        public DateTime creation_date { get; set; }

        //public virtual Knowledge_content Knowledge_content { get; set; }
    }
}