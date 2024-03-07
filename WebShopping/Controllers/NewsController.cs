using AutoMapper;
using WebShopping.Auth;
using WebShopping.Dtos;
using WebShopping.Helpers;
using WebShopping.Models;
using WebShopping.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace WebShopping.Controllers
{
    /// <summary>
    /// 後台最新消息管理
    /// </summary>
    [CustomAuthorize(Role.Admin)]   
    public class NewsController : ApiController
    {
        private INewsService m_newsService;

        private IImageFormatHelper m_imageFormatHelper;

        private IMapper m_Mapper;

        public NewsController(INewsService newsService, IImageFormatHelper imageFormatHelper, IMapper mapper)
        {
            m_newsService = newsService;
            m_imageFormatHelper = imageFormatHelper;
            m_Mapper = mapper;
        }

        /// <summary>
        /// 取得單筆消息資料
        /// </summary>
        /// <param name="id">消息ID</param>
        /// <returns>200;單筆消息資料</returns>
        [AllowAnonymous]
        public IHttpActionResult GetNews(Guid id)
        {
            News _news = m_newsService.GetNewsData(id);

            if (_news != null)
            {
                NewsGetDto _newsGetDto = SwitchNewsData(_news);

                return Ok(_newsGetDto);
            }
            else
            {
                return Ok();//return NotFound();
            }
        }

        private NewsGetDto SwitchNewsData(News news)
        {
            NewsGetDto _newsGetDto = new NewsGetDto();

            _newsGetDto.Id = news.Id;
            _newsGetDto.Title = news.Title;
            _newsGetDto.Contents = news.Contents;
            _newsGetDto.Image_Url = news.Image_Name;
            _newsGetDto.First = news.First;
            _newsGetDto.Date = news.Created_Date.ToString("yyyy-MM-dd HH:mm");
            _newsGetDto.Enabled = news.Enabled;
            if (DateTime.MinValue != news.Start_Date)
                _newsGetDto.Start_Date = news.Start_Date.ToString("yyyy/MM/dd HH:mm");
            if (DateTime.MinValue != news.End_Date)
                _newsGetDto.End_Date = news.End_Date.ToString("yyyy/MM/dd HH:mm");

            return _newsGetDto;
        }

        /// <summary>
        /// 取得全部消息資料
        /// </summary>
        /// <returns>200;全部消息資料</returns>
        [AllowAnonymous]
        public IHttpActionResult GetNews()
        {
            HttpRequest _request = HttpContext.Current.Request; //取得使用者要求的Request物件

            int? count = null;
            if (!string.IsNullOrWhiteSpace(_request["count"])) count = Convert.ToInt32(_request["count"]);

            int? page = null;
            if (!string.IsNullOrWhiteSpace(_request["page"])) page = Convert.ToInt32(_request["page"]);

            List<News> _news = m_newsService.GetNewsSetData(count, page);

            if (_news.Count > 0)
            {
                List<NewsGetDto> _newsGetDtos = SwitchNewsSetData(_news);

                return Ok(_newsGetDtos);
            }
            else
            {
                return Ok();//return NotFound();
            }
        }

        private List<NewsGetDto> SwitchNewsSetData(List<News> news)
        {
            List<NewsGetDto> _newsGetDtos = new List<NewsGetDto>();

            for (int i = 0; i < news.Count; i++)
            {
                NewsGetDto _newsGetDto = new NewsGetDto();

                _newsGetDto.Id = news[i].Id;
                _newsGetDto.Title = news[i].Title;
                _newsGetDto.Contents = news[i].Contents;
                _newsGetDto.Image_Url = news[i].Image_Name;
                _newsGetDto.First = news[i].First;
                _newsGetDto.Date = news[i].Created_Date.ToString("yyyy-MM-dd HH:mm");
                _newsGetDto.Enabled = news[i].Enabled;
                if (DateTime.MinValue != news[i].Start_Date)
                    _newsGetDto.Start_Date = news[i].Start_Date.ToString("yyyy/MM/dd HH:mm");
                if (DateTime.MinValue != news[i].End_Date)
                    _newsGetDto.End_Date = news[i].End_Date.ToString("yyyy/MM/dd HH:mm");

                _newsGetDtos.Add(_newsGetDto);
            }

            return _newsGetDtos;
        }

        /// <summary>
        /// 新增一筆最新消息
        /// </summary>
        /// <returns>201;新增消息資料</returns>
        [HttpPost]
        public IHttpActionResult InsertNew()
        {
            try
            {
                HttpRequest _request = HttpContext.Current.Request; //取得使用者要求的Request物件

                if (string.IsNullOrWhiteSpace(_request.Form.Get("title")))
                {
                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, _request.Form.Get("title") == null ? "必須有title參數" : "title參數格式錯誤"));
                }

                if (string.IsNullOrWhiteSpace(_request.Form.Get("content")))
                {
                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, _request.Form.Get("content") == null ? "必須有content參數" : "content參數格式錯誤"));
                }

                if (_request.Form.Get("fNameArr") == null)
                {
                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "必須有fNameArr參數"));
                }

                if (_request.Files.Count == 0)
                {
                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "必須上傳圖片檔案"));
                }

                if (m_imageFormatHelper.CheckImageMIME(_request.Files) == false)
                {
                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "上傳圖片格式錯誤"));
                }

                News _news = m_newsService.InsertNewData(_request);

                NewsInsertDto _newsInsertDto = new NewsInsertDto();
                _newsInsertDto.Id = _news.Id;
                _newsInsertDto.Title = _news.Title;
                _newsInsertDto.Created_Date = _news.Created_Date.ToString("yyyy-MM-dd");
                _newsInsertDto.Enabled = _news.Enabled;
                _newsInsertDto.First = _news.First;
                if (_news.Start_Date != DateTime.MinValue)
                    _newsInsertDto.Start_Date = _news.Start_Date.ToString("yyyy-MM-dd");
                if (_news.End_Date != DateTime.MinValue)
                    _newsInsertDto.End_Date = _news.End_Date.ToString("yyyy-MM-dd");


                return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, _newsInsertDto));
            }
            catch (Exception ex)
            {
                Helpers.SystemFunctions.WriteLogFile($"{ex.Message}\n{ex.StackTrace}");
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }

        /// <summary>
        /// 上傳內容圖片
        /// </summary>
        /// <returns>201;圖片URL</returns>
        [HttpPost]
        [Route("News/AddContentImage")]
        public IHttpActionResult AddContentImage()
        {
            try
            {
                HttpRequest _request = HttpContext.Current.Request; //取得使用者要求的Request物件

                if (_request.Files.Count == 0)
                {
                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "必須上傳圖片檔案"));
                }

                if (m_imageFormatHelper.CheckImageMIME(_request.Files) == false)
                {
                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "上傳圖片格式錯誤"));
                }

                string _imageUrl = m_newsService.UploadImage(_request);

                return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, new { Image_Url = _imageUrl }));
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }

        /// <summary>
        /// 更新一筆最新消息
        /// </summary>
        /// <param name="id">消息ID</param>
        /// <returns>204</returns>
        [HttpPut]
        public IHttpActionResult UpdateNew(Guid id)
        {
            try
            {
                News _news = m_newsService.GetNewsData(id);

                if (_news != null)
                {
                    HttpRequest _request = HttpContext.Current.Request; //取得使用者要求的Request物件

                    if (string.IsNullOrWhiteSpace(_request.Form.Get("title")))
                    {
                        return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, _request.Form.Get("title") == null ? "必須有title參數" : "title參數格式錯誤"));
                    }

                    if (string.IsNullOrWhiteSpace(_request.Form.Get("content")))
                    {
                        return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, _request.Form.Get("content") == null ? "必須有content參數" : "content參數格式錯誤"));
                    }

                    if (m_imageFormatHelper.CheckImageMIME(_request.Files) == false)
                    {
                        return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "上傳圖片格式錯誤"));
                    }

                    m_newsService.UpdateNewData(_request, _news);

                    return StatusCode(HttpStatusCode.NoContent);
                }
                else
                {
                    return Ok();//return NotFound();
                }
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }

        /// <summary>
        /// 更新一筆最新消息的內容圖片
        /// </summary>
        /// <param name="id">消息ID</param>
        /// <returns>204</returns>
        [HttpPut]
        [Route("News/UpdateContentImage/{id}")]
        public IHttpActionResult UpdateContentImage(Guid id)
        {
            try
            {
                News _news = m_newsService.GetNewsData(id);

                if (_news != null)
                {
                    HttpRequest _request = HttpContext.Current.Request; //取得使用者要求的Request物件

                    if (_request.Files.Count == 0)
                    {
                        return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "必須上傳圖片檔案"));
                    }

                    if (m_imageFormatHelper.CheckImageMIME(_request.Files) == false)
                    {
                        return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "上傳圖片格式錯誤"));
                    }

                    string _imageUrl = m_newsService.UpdateUploadImage(_request, id);

                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, new { Image_Url = _imageUrl }));
                }
                else
                {
                    return Ok();//return NotFound();
                }

            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }

        /// <summary>
        /// 更新一筆消息是否置頂選項
        /// </summary>
        /// <param name="id">消息ID</param>
        /// <param name="newsUpdateDto">更新資料的參數類別</param>
        /// <returns>204</returns>
        [HttpPut]
        [Route("News/UpdateTopOption/{id}")]
        public IHttpActionResult UpdateTopOption(Guid id, [FromBody] NewsUpdateDto newsUpdateDto)
        {
            if (ModelState.IsValid)
            {
                News _news = m_newsService.GetNewsData(id);

                if (_news != null)
                {
                    _news.First = newsUpdateDto.First;
                    _news.Updated_Date = DateTime.Now;

                    m_newsService.UpdateTopOption(_news);

                    return StatusCode(HttpStatusCode.NoContent);
                }
                else
                {
                    return Ok();//return NotFound();
                }
            }
            else
            {
                var _errMsg = string.Join("; ", ModelState.Values
                                    .SelectMany(x => x.Errors)
                                    .Where(x => !string.IsNullOrEmpty(x.ErrorMessage))
                                    .Select(x => x.ErrorMessage));
                return Content(HttpStatusCode.BadRequest, _errMsg);
            }
        }

        /// <summary>
        /// 刪除一筆最新消息
        /// </summary>
        /// <param name="id">消息ID</param>
        /// <returns>204</returns>
        [HttpDelete]
        public IHttpActionResult DeleteNews(Guid id)
        {
            News _news = m_newsService.GetNewsData(id);

            if (_news != null)
            {
                m_newsService.DeleteNewData(_news);

                return StatusCode(HttpStatusCode.NoContent);
            }
            else
            {
                return Ok();//return NotFound();
            }
        }
    }
}
