﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebShopping.Dtos
{
    public class Lighting_category_Dto
    {
        public int id { get; set; }

        public string name { get; set; }

        public string content { get; set; }

        //public DateTime creation_date { get; set; }

        //public DateTime? updated_date { get; set; }

        /// <summary>
        /// bool改byte 狀態(上下架)
        /// </summary>
        public byte Enabled { get; set; }

        public int Sort { get; set; }

        //public virtual ICollection<Lighting_content> Lighting_content { get; set; }
    }
}