﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebShopping.Dtos
{
    public class MainCategoryInsertDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }      
    }
}