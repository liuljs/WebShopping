using AutoMapper;
using WebShopping.Auth;
using WebShopping.Dtos;
using WebShopping.Helpers;
using WebShopping.Models;
using WebShopping.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace WebShopping.Controllers
{
    /// <summary>
    /// 輪撥圖管理
    /// </summary>
    [CustomAuthorize(Role.Admin)]
    public class IndexSlideshowController : ApiController
    {
        private IIndexSlideshowService m_indexSlideshowService;

        private IImageFormatHelper m_imageFormatHelper;

        private IMapper m_Mapper;

        public IndexSlideshowController(IIndexSlideshowService indexSlideshowService, IImageFormatHelper imageFormatHelper, IMapper mapper)
        {
            m_indexSlideshowService = indexSlideshowService;
            m_imageFormatHelper = imageFormatHelper;
            m_Mapper = mapper;
        }

        [AllowAnonymous]
        /// <summary>
        /// 取得單一筆輪播圖片資訊
        /// </summary>
        /// <param name="id">單筆輪播資訊的ID</param>
        /// <returns>200(OK);單筆輪播資訊內容</returns>        
        public IHttpActionResult GetIndexSlideshow(Guid id)
        {
            var _indexSlideshow = m_indexSlideshowService.GetIndexSlideshowImage(id);

            if (_indexSlideshow != null)
            {
                //IndexSlideshowGetDto _slideshowGetDto = SwitchIndexSlideshowData(_indexSlideshow);

                IndexSlideshowGetDto _slideshowGetDto = m_Mapper.Map<IndexSlideshowGetDto>(_indexSlideshow);

                return Ok(_slideshowGetDto);
            }
            else
            {
                return Ok();//return NotFound();
            }
        }

        private IndexSlideshowGetDto SwitchIndexSlideshowData(IndexSlideshow indexSlideshow)
        {
            IndexSlideshowGetDto _slideshowGetDto = new IndexSlideshowGetDto();
            _slideshowGetDto.Id = indexSlideshow.Id;
            _slideshowGetDto.File_Name = indexSlideshow.File_Name;
            _slideshowGetDto.Image_Url = indexSlideshow.Image_Url;
            _slideshowGetDto.Image_Link = indexSlideshow.Image_Link;
            _slideshowGetDto.First = indexSlideshow.First;
            _slideshowGetDto.Creation_Date = indexSlideshow.Creation_Date.ToString("yyyy-MM-dd");

            return _slideshowGetDto;
        }

        [AllowAnonymous]
        /// <summary>
        /// 取得全部輪播圖片資訊
        /// </summary>       
        /// <returns>200(OK);全部輪播資訊內容</returns>
        public IHttpActionResult GetIndexSlideshows()
        {
            var _indexSlideshows = m_indexSlideshowService.GetIndexSlideshowImages();

            if (_indexSlideshows.Count > 0)
            {
                //List<IndexSlideshowGetDto> _slideshowGetDtos = SwitchIndexSlideshowData(_indexSlideshows);
                List<IndexSlideshowGetDto> _slideshowGetDtos = m_Mapper.Map<List<IndexSlideshowGetDto>>(_indexSlideshows);

                return Ok(_slideshowGetDtos);
            }
            else
            {
                return Ok();//return NotFound();
            }
        }

        private List<IndexSlideshowGetDto> SwitchIndexSlideshowData(List<IndexSlideshow> indexSlideshows)
        {
            List<IndexSlideshowGetDto> _slideshowGetDtos = new List<IndexSlideshowGetDto>();

            for (int i = 0; i < indexSlideshows.Count; i++)
            {
                IndexSlideshowGetDto _slideshowGetDto = new IndexSlideshowGetDto();
                _slideshowGetDto.Id = indexSlideshows[i].Id;
                _slideshowGetDto.File_Name = indexSlideshows[i].File_Name;
                _slideshowGetDto.Image_Url = indexSlideshows[i].Image_Url;
                _slideshowGetDto.Image_Link = indexSlideshows[i].Image_Link;
                _slideshowGetDto.First = indexSlideshows[i].First;
                _slideshowGetDto.Creation_Date = indexSlideshows[i].Creation_Date.ToString("yyyy-MM-dd");

                _slideshowGetDtos.Add(_slideshowGetDto);
            }

            return _slideshowGetDtos;
        }

        /// <summary>
        /// 新增一筆輪播圖片資訊
        /// </summary>
        /// <returns>201(Created);新增資料的資訊</returns>
        [HttpPost]
        public IHttpActionResult InsertIndexSlideshow()
        {                 
            try
            {
                // Check if the request contains multipart/form-data.
                //if (!Request.Content.IsMimeMultipartContent())
                //{
                //    return StatusCode(HttpStatusCode.UnsupportedMediaType);
                //}
               
                HttpRequest _request = HttpContext.Current.Request; //取得使用者要求的Request物件

                if (_request.Form.Get("first") == null)
                {
                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "必須有first參數"));
                }

                if (_request.Form["first"].Length > 1 || (_request.Form["first"] != "Y" && _request.Form["first"] != "N"))
                {
                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "first參數格式錯誤"));
                }

                if (_request.Files.Count == 0)
                {
                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "必須上傳圖片檔案"));
                }

                if (m_imageFormatHelper.CheckImageMIME(_request.Files) == false)
                {
                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "上傳圖片格式錯誤"));
                }
            
                IndexSlideshow _result = m_indexSlideshowService.AddIndexSlideshowImage(_request); //新增首頁輪播圖片

                IndexSlideshowInsertDto indexSlideshowInsertDto = new IndexSlideshowInsertDto();
                indexSlideshowInsertDto.Id = _result.Id;
                indexSlideshowInsertDto.File_Name = _result.File_Name;
                indexSlideshowInsertDto.Date = _result.Creation_Date.ToString("yyyy-MM-dd");

                return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, indexSlideshowInsertDto));
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }

        /// <summary>
        /// 更新一筆輪播圖片資訊
        /// </summary>
        /// <param name="id">單筆輪播資訊的ID</param>
        /// <param name="slideshowUpdateDto">更新的資料類別</param>
        /// <returns>204(NoContent)</returns>
        [HttpPut]
        public IHttpActionResult PutIndexSlideshow(Guid id, [FromBody] IndexSlideshowUpdateDto slideshowUpdateDto)
        {
            if (ModelState.IsValid)
            {
                var _indexSlideshow = m_indexSlideshowService.GetIndexSlideshowImage(id);

                if (_indexSlideshow != null)
                {
                    _indexSlideshow.Image_Link = string.IsNullOrWhiteSpace(slideshowUpdateDto.Image_Link) ? _indexSlideshow.Image_Link : slideshowUpdateDto.Image_Link;
                    _indexSlideshow.First = slideshowUpdateDto.First;

                    m_indexSlideshowService.UpdateIndexSlideshowImage(_indexSlideshow);

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
        /// 刪除一筆輪播圖片資訊
        /// </summary>
        /// <param name="id">單筆輪播資訊的ID</param>
        /// <returns>204(NoContent)</returns>
        [HttpDelete]
        public IHttpActionResult DeleteIndexSlideshow(Guid id)
        {
            try
            {
                var _indexSlideshow = m_indexSlideshowService.GetIndexSlideshowImage(id);
                if (_indexSlideshow != null)
                {
                    m_indexSlideshowService.DeleteIndexSlideshowImage(_indexSlideshow);

                    return StatusCode(HttpStatusCode.NoContent);
                }
                else
                {
                    return Ok();//return NotFound();
                }
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
