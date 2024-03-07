using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebShopping.Dtos
{
    public class article_content_Dto
    {
        public Guid id { get; set; }
        public int article_category_id { get; set; }
        public string title { get; set; }
        public string image_name { get; set; }
        public string brief { get; set; }
        public string content { get; set; }
        public string creation_date { get; set; }
        //public DateTime creation_date { get; set; }
        /// <summary>
        /// 狀態(上下架)
        /// </summary>
        public byte Enabled { get; set; }
        public int Sort { get; set; }
        public string First { get; set; }
        public string Article_Category_Name { get; set; }
        /// <summary>
        /// 文章分類
        /// </summary>
        //public article_category_Dto Article_Category_Collection { get; set; }
    }
}