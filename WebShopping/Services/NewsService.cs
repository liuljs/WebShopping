using WebShopping.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dapper;
using WebShopping.Connection;
using System.IO;
using WebShopping.Helpers;
using System.Configuration;
using Newtonsoft.Json;
using WebShopping.Dtos;

namespace WebShopping.Services
{
    public class NewsService : INewsService
    {
        private IImageFileHelper m_ImageFileHelper;

        private IDapperHelper m_DapperHelper;

        private string m_imageFolder = @"\Admin\backStage\img\news\";

        public NewsService(IImageFileHelper imageFileHelper, IDapperHelper dapperHelper)
        {
            m_ImageFileHelper = imageFileHelper;
            m_DapperHelper = dapperHelper;
        }

        /// <summary>
        /// 取得單筆最新消息資料
        /// </summary>
        /// <param name="id">消息ID</param>
        /// <returns>單筆消息資料</returns>
        public News GetNewsData(Guid id)
        {
            News _news = new News();
            _news.Id = id;

            string adminQuery = Auth.Role.IsAdmin ? "" : " AND Enabled=1 And (START_DATE IS NULL OR getdate()>=START_DATE) And (END_DATE IS NULL OR getdate()<END_DATE) ";
            string _sql = $"SELECT * FROM [NEWS] WHERE [ID]=@ID {adminQuery} ";

            _news = m_DapperHelper.QuerySqlFirstOrDefault(_sql, _news);

            if (_news != null)
            {
                _news.Image_Name = m_ImageFileHelper.GetImageLink(ConfigurationManager.AppSettings["News"], _news.Image_Name);
            }

            return _news;
        }

        /// <summary>
        /// 取得全部最新消息資料
        /// </summary>
        /// <returns>全部消息資料</returns>
        public List<News> GetNewsSetData(int? count, int? page)
        {
            string pages = "", where = "";
            if (count != null && count > 0 && page != null && page > 0)
            {
                int startRowIndex = 0;
                startRowIndex = Convert.ToInt32(page - 1) * Convert.ToInt32(count);
                pages = $" OFFSET {startRowIndex} ROWS FETCH NEXT {count} ROWS ONLY ";
            }

            string adminQuery = Auth.Role.IsAdmin ? "" : " Where Enabled=1 And (START_DATE IS NULL OR getdate()>=START_DATE) And (END_DATE IS NULL OR getdate()<END_DATE) ";
            string _sql = $@"SELECT * FROM [NEWS] 
                {adminQuery} 
                ORDER BY [First] DESC,created_date DESC
                {pages} ";

            List<News> _news = m_DapperHelper.QuerySetSql<News>(_sql).ToList();

            for (int i = 0; i < _news.Count; i++)
            {
                _news[i].Image_Name = m_ImageFileHelper.GetImageLink(ConfigurationManager.AppSettings["News"], _news[i].Image_Name);             
            }

            return _news;
        }

        /// <summary>
        /// 新增最新消息
        /// </summary>
        /// <param name="request">用戶端的要求資訊</param>
        /// <returns>新增消息的資料</returns>
        public News InsertNewData(HttpRequest request)
        {
            News _new = SetInsertNewData(request);

            string _sql = @"INSERT INTO [NEWS] (ID, TITLE, CONTENTS, IMAGE_NAME, FIRST, CREATED_DATE, Enabled, Start_Date, End_Date) 
                        VALUES (@ID ,@TITLE,@CONTENTS, @IMAGE_NAME, @FIRST, @CREATED_DATE, @Enabled, @Start_Date, @End_Date)";
            if (_new.Start_Date == DateTime.MinValue)
                _sql = _sql.Replace("@Start_Date", "NULL");
            if (_new.End_Date == DateTime.MinValue)
                _sql = _sql.Replace("@End_Date", "NULL");

            m_DapperHelper.ExecuteSql(_sql, _new);

            //取得圖片存放目錄            
            string _saveFolderPath = GetSaveImageFolderPath();

            //存放上傳封面圖片檔案
            m_ImageFileHelper.SaveUploadImageFile(request.Files[0], _new.Image_Name, _saveFolderPath);

            HandleContentImages(request.Form["fNameArr"], _saveFolderPath, _new.Id);

            RemoveContentImages(_saveFolderPath);

            return _new;
        }

        private string GetSaveImageFolderPath()
        {
            //取得圖片存放目錄
            string _rootPath = Path.GetDirectoryName(Path.GetDirectoryName(HttpContext.Current.Server.MapPath("/")));
            string _saveFolderPath = m_ImageFileHelper.GetImageFolderPath(_rootPath, m_imageFolder);

            return _saveFolderPath;
        }

        /// <summary>
        /// 設置新增消息的資料
        /// </summary>
        /// <param name="request">用戶端的要求資訊</param>
        /// <returns>新增消息的資料</returns>
        private News SetInsertNewData(HttpRequest request)
        {
            News _new = new News();
            _new.Id = Guid.NewGuid(); //訊息的 id
            _new.Image_Name = _new.Id + ".png"; //圖片檔名
            _new.Title = request.Form["title"]; //訊息標題
            _new.Contents = request.Form["content"]; //訊息內容

            //是否置頂
            if ("Y" == request.Form["First"]) _new.First = "Y";
            else _new.First = "N";

            _new.Enabled = Convert.ToByte(request.Form["Enabled"]); //啟停用

            //上架日
            if (Tools.Formatter.IsDate(request.Form["Start_Date"]))
                _new.Start_Date = Convert.ToDateTime(request.Form["Start_Date"]);

            //下架日
            if (Tools.Formatter.IsDate(request.Form["End_Date"]))
                _new.End_Date = Convert.ToDateTime(request.Form["End_Date"]); 

            _new.Created_Date = DateTime.Now; //新增時間

            return _new;
        }

        /// <summary>
        /// 搬移內容圖片位置和建立消息和內容圖片之間的連結
        /// </summary>
        /// <param name="images">內容圖片的檔名Json字串</param>
        /// <param name="rootPath">目前程式根目錄</param>
        /// <param name="saveFolderPath">圖片保存目錄</param>
        /// <param name="newsId">新增消息的ID</param>
        private void HandleContentImages(string images, string saveFolderPath, Guid newsId)
        {
            //取得回傳內容圖片的檔名
            List<string> _retFileNameList = JsonConvert.DeserializeObject<List<string>>(images);

            //取得存放News目錄下所有.png圖檔路徑
            var _imageFileList = Directory.GetFiles(saveFolderPath, "*.png").ToList();

            if (_retFileNameList != null && _retFileNameList.Count > 0)
            {
                for (int i = 0; i < _retFileNameList.Count; i++)
                {
                    for (int y = 0; y < _imageFileList.Count; y++)
                    {
                        string _urlFileName = _retFileNameList[i].ToLower().Trim();
                        string _entityFileName = Path.GetFileName(_imageFileList[y]);
                        string _imageGuid = Path.GetFileNameWithoutExtension(_imageFileList[y]);

                        if (_urlFileName == _entityFileName && File.Exists(_imageFileList[y]))
                        {
                            //string _newFileName = $"Image{_nameCount}.png";
                            //File.Move(_imageFileList[y], $@"{saveFolderPath}{_entityFileName}");
                            //_imageFileList.RemoveAt(y);

                            NewsImage _newsImage = new NewsImage();
                            _newsImage.Id = Guid.Parse(_imageGuid);
                            _newsImage.News_Id = newsId;
                            //_newsImage.Image_Name = _entityFileName;

                            string _sql = @"UPDATE [NEWS_IMAGE] 
                                            SET NEWS_ID = @NEWS_ID
                                            WHERE ID = @ID";

                            m_DapperHelper.ExecuteSql(_sql, _newsImage);
                        }
                    }
                }
            }
        }

        /// <summary>
        /// 刪除不用的內容圖片
        /// </summary>
        /// <param name="imageFileList">多餘的內容圖片路徑集合</param>
        private void RemoveContentImages(string saveFolderPath)
        {
            //取得存放News目錄下所有.png圖檔路徑
            var _imageFileList = Directory.GetFiles(saveFolderPath, "*.png").ToList();

            //查詢多餘的上傳內容圖片
            string _sql = @"SELECT [IMAGE_NAME] FROM [NEWS_IMAGE] WHERE NEWS_ID IS NULL";

            List<string> _imageDataBaseList = m_DapperHelper.QuerySetSql<string>(_sql).ToList();

            //刪除多餘的內容圖檔
            for (int y = 0; y < _imageDataBaseList.Count; y++)
            {
                for (int i = 0; i < _imageFileList.Count; i++)
                {
                    string _removeFileName = Path.GetFileName(_imageFileList[i]);

                    if (_imageDataBaseList[y] == _removeFileName && File.Exists(_imageFileList[i]))
                    {
                        File.Delete(_imageFileList[i]);
                    }
                }
            }

            //刪除資料庫裡無相關連消息的內容圖片記錄
            _sql = @"DELETE FROM [NEWS_IMAGE] WHERE NEWS_ID IS NULL";

            m_DapperHelper.ExecuteSql(_sql);
        }

        /// <summary>
        /// 上傳內容圖片
        /// </summary>
        /// <param name="request">用戶端的要求資訊</param>
        /// <returns>圖片URL</returns>
        public string UploadImage(HttpRequest request)
        {
            NewsImage _newsImage = new NewsImage();
            _newsImage.Id = Guid.NewGuid(); //圖片的 id
            _newsImage.Image_Name = _newsImage.Id + ".png"; //圖片檔名

            //取得圖片存放目錄            
            string _saveFolderPath = GetSaveImageFolderPath();

            //存放上傳圖片檔案
            m_ImageFileHelper.SaveUploadImageFile(request.Files[0], _newsImage.Image_Name, _saveFolderPath);

            //取得上傳圖片的URL
            string _imageUrl = m_ImageFileHelper.GetImageLink(ConfigurationManager.AppSettings["News"], _newsImage.Image_Name);

            string _sql = @"INSERT INTO [NEWS_IMAGE] ([ID], [IMAGE_NAME]) VALUES (@ID, @IMAGE_NAME)";

            m_DapperHelper.ExecuteSql(_sql, _newsImage);

            return _imageUrl;
        }

        /// <summary>
        /// 更新單筆消息資料
        /// </summary>
        /// <param name="request">用戶端的要求資訊</param>
        /// <param name="news">更新的資料類別</param>
        public void UpdateNewData(HttpRequest request, News news)
        {
            news.Title = request.Form["title"];
            news.Contents = request.Form["content"];
            news.Updated_Date = DateTime.Now;

            //是否置頂
            if ("Y" == request.Form["First"]) news.First = "Y";
            else news.First = "N";

            news.Enabled = Convert.ToByte(request.Form["Enabled"]); //啟停用

            //上架日
            if (Tools.Formatter.IsDate(request.Form["Start_Date"]))
                news.Start_Date = Convert.ToDateTime(request.Form["Start_Date"]);
            else
                news.Start_Date = DateTime.MinValue;

            //下架日
            if (Tools.Formatter.IsDate(request.Form["End_Date"]))
                news.End_Date = Convert.ToDateTime(request.Form["End_Date"]);
            else
                news.End_Date = DateTime.MinValue;

            if (request.Files.Count > 0)
            {
                //取得圖片存放目錄            
                string _saveFolderPath = GetSaveImageFolderPath();

                //因為回傳是URL只需要圖片檔名
                var _imageName = Path.GetFileName(news.Image_Name);

                //存放上傳圖片檔案
                m_ImageFileHelper.SaveUploadImageFile(request.Files[0], _imageName, _saveFolderPath);
            }

            string _sql = $@"UPDATE [NEWS] 
                             SET [TITLE]=@TITLE,[CONTENTS]=@CONTENTS,[UPDATED_DATE]=@UPDATED_DATE,[First]=@First,Enabled=@Enabled
                            ,Start_Date=@Start_Date,End_Date=@End_Date
                             WHERE [ID]=@ID";

            if (news.Start_Date == DateTime.MinValue)
                _sql = _sql.Replace("@Start_Date", "NULL");
            if (news.End_Date == DateTime.MinValue)
                _sql = _sql.Replace("@End_Date", "NULL");

            m_DapperHelper.ExecuteSql(_sql, news);
        }

        /// <summary>
        /// 更新上傳內容圖片
        /// </summary>
        /// <param name="request">用戶端的要求資訊</param>
        /// <param name="newsId"></param>
        /// <returns></returns>
        public string UpdateUploadImage(HttpRequest request, Guid newsId)
        {
            NewsImage _newsImage = new NewsImage();
            _newsImage.Id = Guid.NewGuid(); //圖片的 id
            _newsImage.Image_Name = _newsImage.Id + ".png"; //圖片檔名
            _newsImage.News_Id = newsId; //關聯的消息 ID

            //取得圖片存放目錄            
            string _saveFolderPath = GetSaveImageFolderPath();

            //存放上傳圖片檔案
            m_ImageFileHelper.SaveUploadImageFile(request.Files[0], _newsImage.Image_Name, _saveFolderPath);

            //取得上傳圖片的URL
            string _imageUrl = m_ImageFileHelper.GetImageLink(ConfigurationManager.AppSettings["News"], _newsImage.Image_Name);

            string _sql = @"INSERT INTO [NEWS_IMAGE] ([ID], [IMAGE_NAME], [NEWS_ID]) VALUES (@ID, @IMAGE_NAME, @NEWS_ID)";

            m_DapperHelper.ExecuteSql(_sql, _newsImage);

            return _imageUrl;
        }

        /// <summary>
        /// 更新是否置頂選項
        /// </summary>
        /// <param name="news">更新的消息資料類別</param>
        public void UpdateTopOption(News news)
        {
            string _sql = @"UPDATE [NEWS] SET [FIRST] = @FIRST, [UPDATED_DATE] = @UPDATED_DATE WHERE ID = @ID";

            m_DapperHelper.ExecuteSql(_sql, news);
        }

        /// <summary>
        /// 刪除一筆最新消息和圖片檔案
        /// </summary>
        /// <param name="id">消息ID</param>
        public void DeleteNewData(News news)
        {
            //取得圖片存放目錄            
            string _saveFolderPath = GetSaveImageFolderPath();

            string _sql = @"SELECT [IMAGE_NAME] FROM [NEWS_IMAGE] WHERE [NEWS_ID] = @ID";

            //取得這筆消息相關內容圖片檔名
            List<string> _contentImageNameList = m_DapperHelper.QuerySetSql<News, string>(_sql, news).ToList();

            string _contentImageFilePath = string.Empty;

            //刪除內容圖檔
            for (int i = 0; i < _contentImageNameList.Count; i++)
            {
                _contentImageFilePath = Path.Combine(_saveFolderPath, _contentImageNameList[i]);

                if (File.Exists(_contentImageFilePath))
                {
                    File.Delete(_contentImageFilePath);
                }
            }

            //取得封面圖片檔案
            string _coverImageName = Path.GetFileName(news.Image_Name);
            string _coverImageFilePath = Path.Combine(_saveFolderPath, _coverImageName);

            //刪除封面圖檔
            if (File.Exists(_coverImageFilePath))
            {
                File.Delete(_coverImageFilePath);
            }

            _sql = @"DELETE FROM [NEWS] WHERE ID = @ID";

            m_DapperHelper.ExecuteSql(_sql, news);
        }
    }
}