﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using WebShopping.Models;

namespace WebShopping.Services
{
    public interface IKnowledgeContentService
    {
            /// <summary>
            /// 1.新增
            /// </summary>
            /// <param name="_request">用戶端送來的表單資訊</param>
            /// <returns>201 Created; 資料</returns>
            Knowledge_content Insert_Knowledge_content(HttpRequest _request);
            /// <summary>
            /// 新增一個Knowledge_image內文圖片並回傳return $@"{m_WebSiteImgUrl}/{folder}/{fileName}"; //回傳圖片的URL && 檔名
            /// </summary>
            /// <param name="request">內容區圖片要求資訊</param>
            /// <returns>201, _imageUrl圖片URL</returns>
            string AddUploadImage(HttpRequest _request);


            /// <summary>
            ///2. 取得一筆
            /// </summary>
            /// <param name="id">輸入id編號</param>
            /// <returns>200 Ok取得一筆資料,404 NotFound</returns>
            Knowledge_content Get_Knowledge_content(Guid id);


            /// <summary>
            /// 3.修改
            /// </summary>
            /// <param name="request">輸入id編號</param>
            /// <param name="_Knowledge_content">要修改的內容</param>
            /// <returns>204 No Content , 404 NotFound</returns>
            void Update_Knowledge_content(HttpRequest request, Knowledge_content _Knowledge_content);
            /// <summary>
            /// 新增一筆Knowledge_image內容圖片,有關聯ID, 適用於在修改時使用
            /// </summary>
            /// <param name="request">用戶端的要求資訊</param>
            /// <param name="Knowledge_content_Id"></param>
            /// <returns></returns>
            string AddUploadImage(HttpRequest request, Guid Knowledge_content_Id);


            /// <summary>
            /// 4.刪除一筆
            /// </summary>
            /// <param name="id">輸入id編號</param>
            /// <param name="_Knowledge_content">用id找出資料後給類別，類別id在刪資料</param>
            /// <returns>成功204 , 失敗404</returns>
            void Delete_Knowledge_content(Knowledge_content _Knowledge_content);

            /// <summary>
            /// 5.取得所有
            /// </summary>
            /// <param name="_count">一頁要顯示幾筆</param>
            /// <param name="_page">第幾頁開始</param>
            /// <returns></returns>
            List<Knowledge_content> Get_Knowledge_content_ALL(int? _count, int? _page);


    }
}
