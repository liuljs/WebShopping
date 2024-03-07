using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;

namespace WebShopping.Dtos
{
    public class NewsInsertDto
    {
        private string start_Date = string.Empty;
        private string end_Date = string.Empty;

        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Created_Date { get; set; }
        public byte Enabled { get; set; }
        public string First { get; set; }
        [DefaultValue("")]
        public string Start_Date { get { return start_Date; } set { start_Date = value; } }
        [DefaultValue("")]
        public string End_Date { get {return end_Date; } set { end_Date = value; } }
    }
}