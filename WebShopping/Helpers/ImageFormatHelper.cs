using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebShopping.Helpers
{
    public class ImageFormatHelper : IImageFormatHelper
    {
        /// <summary>
        /// 透過MIME檢查上傳檔案是否為圖檔
        /// </summary>
        /// <param name="fileCollection">上傳檔案的集合</param>
        /// <returns>true:為圖檔;fale:包含非圖檔</returns>
        public bool CheckImageMIME(HttpFileCollection fileCollection)
        {
            bool _isOk = true;

            for (int i = 0; i < fileCollection.Count; i++)
            {
                var file = fileCollection[i];
                string _type = file.ContentType.ToLower();
                if (!_type.Contains("image"))
                {
                    _isOk = false;
                    break;
                }
            }

            return _isOk;
        }
    }
}