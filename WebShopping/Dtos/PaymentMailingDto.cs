﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebShopping.Dtos
{
    public class PaymentMailingDto
    {
        public Guid Id { get; set; }

        public string Content { get; set; }

        public string Creation_Date { get; set; }
    }
}