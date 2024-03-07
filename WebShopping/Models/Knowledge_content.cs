using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebShopping.Models
{
    public class Knowledge_content
    {
         public Guid id { get; set; }

        [Required]
        [StringLength(50)]
        public string image_name { get; set; }

        [Required]
        [StringLength(255)]
        public string title { get; set; }
        [StringLength(800)]
        public string brief { get; set; }
        public string content { get; set; }
        public DateTime creation_date { get; set; }
        public DateTime? updated_date { get; set; }
        public bool Enabled { get; set; }
        public int Sort { get; set; }

        [Required]
        [StringLength(1)]
        [RegularExpression(@"[Y]|[N]")]
        public string first { get; set; }
        //public virtual ICollection<Knowledge_image> Knowledge_image { get; set; }
    }
}