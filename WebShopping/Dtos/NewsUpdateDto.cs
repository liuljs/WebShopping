using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebShopping.Dtos
{
    public class NewsUpdateDto
    {
        [Required]
        [StringLength(1)]
        [RegularExpression(@"[Y]|[N]")]
        public string First { get; set; }
    }
}