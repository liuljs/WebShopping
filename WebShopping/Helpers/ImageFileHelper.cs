using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;

namespace WebShopping.Helpers
{
    public class ImageFileHelper : IImageFileHelper
    {
        private string m_WebSiteImgUrl = ConfigurationManager.AppSettings["WebSiteImgUrl"];

        /// <summary>
        /// 取得圖片存放目錄路徑
        /// </summary>
        /// <param name="rootFolder">初始路徑</param>
        /// <param name="imageFolder">圖片目錄</param>
        /// <returns>圖片目錄路徑</returns>
        public string GetImageFolderPath(string rootFolder, string imageFolder)
        {
            string _savePath = rootFolder + imageFolder;

            if (!Directory.Exists(_savePath))
                Directory.CreateDirectory(_savePath);

            return _savePath;
        }

        /// <summary>
        /// 保存上傳圖片
        /// </summary>
        /// <param name="postedFile">上傳圖片的PostedFile</param>
        /// <param name="fileName">圖片名稱</param>
        /// <param name="saveFolder">保存目錄</param>
        /// <returns>保存路徑</returns>
        public string SaveUploadImageFile(HttpPostedFile postedFile, string fileName, string saveFolder)
        {
            string _filePath = saveFolder + fileName;

            var file = postedFile;
            if (postedFile.ContentLength > 0)
            {
                file.SaveAs(_filePath);
            }
            else
            {
                throw new FileNotFoundException("上傳圖片檔案錯誤");
            }

            return _filePath;
        }

        /// <summary>
        ///  取得圖片連結字串
        /// </summary>
        /// <param name="p_strFolder"> 依此資料夾存放分類的圖片 </param>        
        /// <param name="p_strName"> 檔名 </param>        
        /// <returns> 圖片連結字串 </returns>
        public string GetImageLink(string folder, string fileName)
        {
            return $@"{m_WebSiteImgUrl}/{folder}/{fileName}"; //回傳圖片的URL && 檔名           
        }
    }
}