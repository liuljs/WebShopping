﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace WebShopping.Models
{
    public class Terms
    {
        /// <summary>
        /// 取得內容的Id
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// 編輯服務條款內容
        /// </summary>
        [MaxLength]        
        public string Content { get; set; }

        /// <summary>
        /// 更新時間
        /// </summary>
        public DateTime Creation_Date { get; set; }
    }
}
