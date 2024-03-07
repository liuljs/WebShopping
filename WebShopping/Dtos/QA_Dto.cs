using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebShopping.Dtos
{
    public class QA_Dto
    {
        public int id { get; set; }

        public string Question { get; set; }

        public string Answer { get; set; }

        public string creation_date { get; set; }

        //public DateTime? updated_date { get; set; }

        public byte Enabled { get; set; }

        public int Sort { get; set; }

    }
}