using WebShopping.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Configuration;
using WebShopping.Helpers;

namespace WebShopping.Services
{
    public class IndexSlideshowService : IIndexSlideshowService
    {
        private IImageFileHelper m_ImageFileHelper;

        private IDapperHelper m_DapperHelper;

        public IndexSlideshowService(IImageFileHelper imageFileHelper, IDapperHelper dapperHelper)
        {
            m_ImageFileHelper = imageFileHelper;
            m_DapperHelper = dapperHelper;
        }

        /// <summary>
        /// 取得單筆輪播圖片資訊
        /// </summary>
        /// <param name="id">單筆輪播資訊的ID</param>
        /// <returns>單筆輪播圖片資訊</returns>
        public IndexSlideshow GetIndexSlideshowImage(Guid id)
        {
            IndexSlideshow _slideshow = new IndexSlideshow();
            _slideshow.Id = id;

            string _sql = @"SELECT * FROM [INDEX_SLIDESHOW] WHERE ID = @ID";

            _slideshow = m_DapperHelper.QuerySqlFirstOrDefault(_sql, _slideshow);
           
            _slideshow.Image_Url = m_ImageFileHelper.GetImageLink(ConfigurationManager.AppSettings["Banners"], _slideshow.File_Name);

            return _slideshow;
        }

        /// <summary>
        /// 取得全部輪播圖片資訊
        /// </summary>
        /// <returns>全部輪播圖片資訊</returns>
        public List<IndexSlideshow> GetIndexSlideshowImages()
        {          
            string _sql = @"SELECT * FROM [INDEX_SLIDESHOW] ORDER BY [FIRST] DESC,CREATION_DATE DESC";

            List<IndexSlideshow> _indexSlideshows = m_DapperHelper.QuerySetSql<IndexSlideshow>(_sql, null).ToList();
          
            for (int i = 0; i < _indexSlideshows.Count; i++)
            {
                _indexSlideshows[i].Image_Url = m_ImageFileHelper.GetImageLink(ConfigurationManager.AppSettings["Banners"], _indexSlideshows[i].File_Name);
            }

            return _indexSlideshows;
        }

        /// <summary>
        /// 新增一筆輪播圖片資訊
        /// </summary>
        /// <param name="request">用戶端的要求資訊</param>
        /// <returns>新增的資訊內容</returns>
        public IndexSlideshow AddIndexSlideshowImage(HttpRequest request)
        {
            IndexSlideshow _indexSlideshow = SetIndexSlideshowInsertData(request);
            
            //存放圖片的目錄路徑
            string _rootPath = Path.GetDirectoryName(Path.GetDirectoryName(HttpContext.Current.Server.MapPath("/")));
            string _imageFolder = @"\Admin\backStage\img\banners\";
            string _saveFolderPath = m_ImageFileHelper.GetImageFolderPath(_rootPath, _imageFolder);

            //存放上傳圖片檔案並回傳存放路徑
            _indexSlideshow.Image_Url = m_ImageFileHelper.SaveUploadImageFile(request.Files[0], _indexSlideshow.File_Name, _saveFolderPath);

            string _sql = @"INSERT INTO [INDEX_SLIDESHOW] ([ID],[FILE_NAME],[IMAGE_URL],[IMAGE_LINK],[FIRST],[CREATION_DATE])               VALUES(@ID, @FILE_NAME, @IMAGE_URL, @IMAGE_LINK, @FIRST, @CREATION_DATE)";

            m_DapperHelper.ExecuteSql(_sql, _indexSlideshow);
           
            return _indexSlideshow;
        }

        private IndexSlideshow SetIndexSlideshowInsertData(HttpRequest request)
        {
            IndexSlideshow _indexSlideshow = new IndexSlideshow();
            var _formData = request.Form;
            _indexSlideshow.First = _formData["first"];
            _indexSlideshow.Image_Link = _formData["image_link"];
            _indexSlideshow.Id = Guid.NewGuid();
            _indexSlideshow.Creation_Date = DateTime.Now;
            _indexSlideshow.File_Name = $"{_indexSlideshow.Id}.png";

            return _indexSlideshow;
        }

        /// <summary>
        /// 更新一筆輪播圖片資料
        /// </summary>
        /// <param name="indexSlideshow">更新的資料類別</param>
        public void UpdateIndexSlideshowImage(IndexSlideshow indexSlideshow)
        {
            string _sql = @"UPDATE [INDEX_SLIDESHOW] 
                            SET IMAGE_LINK = @IMAGE_LINK,FIRST = @FIRST
                            WHERE ID = @ID";

            m_DapperHelper.ExecuteSql(_sql, indexSlideshow);                    
        }

        /// <summary>
        /// 刪除一筆輪播圖片資料
        /// </summary>
        /// <param name="indexSlideshow">刪除的資料類別</param>
        public void DeleteIndexSlideshowImage(IndexSlideshow indexSlideshow)
        {
            string _sql = @"DELETE FROM [INDEX_SLIDESHOW] WHERE ID=@ID";

            m_DapperHelper.ExecuteSql(_sql, indexSlideshow);

            //存放圖片的目錄路徑
            string _rootPath = Path.GetDirectoryName(Path.GetDirectoryName(HttpContext.Current.Server.MapPath("/")));
            string _imageFolder = @"\Admin\backStage\img\banners\";
            string _saveFolderPath = m_ImageFileHelper.GetImageFolderPath(_rootPath, _imageFolder);

            string _removeFileName = Path.GetFileName(indexSlideshow.Image_Url);
            string _removeFilePath = Path.Combine(_saveFolderPath, _removeFileName);

            //刪除輪播圖檔
            if (File.Exists(_removeFilePath))
            {
                File.Delete(_removeFilePath);
            }                     
        }       
    }
}