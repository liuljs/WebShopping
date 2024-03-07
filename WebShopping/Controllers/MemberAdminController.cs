﻿using WebShopping.Auth;
using WebShopping.Dtos;
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
    /// 後台會員管理
    /// </summary>
    [CustomAuthorize(Role.Admin)]
    public class MemberAdminController : ApiController
    {
        private IMemberService m_IMemberService;

        public MemberAdminController(IMemberService IMemberService)
        {
            m_IMemberService = IMemberService;
        }

        /// <summary>
        /// 取得會員基本資料(單一)
        /// </summary>
        /// <param name="id"> 會員的id </param>
        /// <returns></returns>        
        [HttpGet]
        public IHttpActionResult GetMember(Guid id)
        {
            var member_ = m_IMemberService.GetMember(id);

            if (member_ != null)
            {
                SendMemberGetDto dto_ = ReturnGetMember(member_);

                return Ok(dto_);                
            }
            else
            {
                return Ok();//return StatusCode(HttpStatusCode.NotFound);
            }
        }

        /// <summary>
        /// 轉換成GetMember回傳的類別
        /// </summary>
        /// <param name="p_Member"> 會員基本資訊 </param>
        /// <returns></returns>
        private SendMemberGetDto ReturnGetMember(Member p_Member)
        {
            SendMemberGetDto dto_ = new SendMemberGetDto();
            dto_.Id = p_Member.Id;
            dto_.No = $"N{ p_Member.No.ToString("D5")}";
            dto_.Account = p_Member.Account;
            dto_.Name = p_Member.Name;
            dto_.Gender = p_Member.Gender;
            dto_.Creation_Date = p_Member.Creation_Date.ToString("yyyy/MM/dd HH:mm");
            dto_.Birthday = p_Member.Birthday.ToString("yyyy/MM/dd HH:mm");
            dto_.Phone = p_Member.Phone;
            dto_.Address = p_Member.Address;
            dto_.Blacklist = p_Member.Blacklist;
            dto_.Enabled = p_Member.Enabled;


            return dto_;
        }

        /// <summary>
        /// 取得會員基本資料(全部)
        /// </summary>       
        /// <returns></returns>        
        [HttpGet]
        public IHttpActionResult GetMembers()
        {
            HttpRequest _request = HttpContext.Current.Request; //取得使用者要求的Request物件

            int? count = null;
            if (!string.IsNullOrWhiteSpace(_request["count"])) count = Convert.ToInt32(_request["count"]);

            int? page = null;
            if (!string.IsNullOrWhiteSpace(_request["page"])) page = Convert.ToInt32(_request["page"]);

            var members_ = m_IMemberService.GetMembers(count, page);

            if (members_.Count > 0)
            {
                List<SendMemberGetDto> dtos_ = ReturnGetMembers(members_);

                return Ok(dtos_);
            }
            else
            {
                return Ok();//StatusCode(HttpStatusCode.NotFound);
            }
        }

        /// <summary>
        /// 轉換成GetMembers回傳的類別
        /// </summary>
        /// <param name="p_Members"> 會員基本資料串列 </param>
        /// <returns></returns>
        private List<SendMemberGetDto> ReturnGetMembers(List<Member> p_Members)
        {
            List<SendMemberGetDto> dtos_ = new List<SendMemberGetDto>();

            for (int i = 0; i < p_Members.Count; i++)
            {
                SendMemberGetDto dto_ = new SendMemberGetDto();
                dto_.Id = p_Members[i].Id;
                dto_.No = $"N{ p_Members[i].No.ToString("D5")}";
                dto_.Account = p_Members[i].Account;
                dto_.Name = p_Members[i].Name;
                dto_.Gender = p_Members[i].Gender;
                dto_.Creation_Date = p_Members[i].Creation_Date.ToString("yyyy/MM/dd HH:mm");
                dto_.Birthday = p_Members[i].Birthday.ToString("yyyy/MM/dd HH:mm");
                dto_.Phone = p_Members[i].Phone;
                dto_.Address = p_Members[i].Address;
                dto_.Blacklist = p_Members[i].Blacklist;
                dto_.Enabled = p_Members[i].Enabled;

                dtos_.Add(dto_);
            }

            return dtos_;
        }

        [HttpDelete]
        /// <summary>
        /// 刪除會員(1筆)               
        /// </summary>
        /// <param name="id"> 會員的id </param>
        /// <returns></returns>               
        public IHttpActionResult DeleteMember(Guid id)
        {            
            try
            {
                var member_ = m_IMemberService.GetMember(id);
                if (member_ != null)
                {
                    m_IMemberService.DeleteMember(id);

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

        [Route("MemberAdmin/AddMember")]
        [HttpPost]
        /// <summary>
        /// 新增會員資訊
        /// </summary>
        /// <param name="p_RecvMemberAddDto"> 新增的會員資訊 </param>
        /// <returns></returns>
        public IHttpActionResult AddMember(RecvMemberAddDto p_RecvMemberAddDto)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    MessageStatus status_ = m_IMemberService.AddMember(p_RecvMemberAddDto, true);

                    if (status_ == MessageStatus.None)
                    {
                        return StatusCode(HttpStatusCode.NoContent);
                    }
                    else
                    {
                        return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, Convert.ToInt32(status_).ToString()));
                    }
                }
                else
                {
                    var _errMsg = ModelState.Values.Where(x => x.Errors.Count > 0)?.FirstOrDefault()?.Errors.Select(y => y.ErrorMessage).FirstOrDefault();
                    return Content(HttpStatusCode.BadRequest, _errMsg);
                }
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPut]
        /// <summary>
        /// 更新會員資訊
        /// </summary>
        /// <param name="p_RecvMemberUpdateDto"> 更新的會員資訊 </param>
        /// <returns></returns>
        public IHttpActionResult UpdateMember(Guid id, [FromBody] RecvMemberUpdateDto p_RecvMemberUpdateDto)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    //string strReturn_ = m_IMemberService.UpdateMember(id, p_RecvMemberUpdateDto, true);
                    MessageStatus status_ = m_IMemberService.UpdateMember(id, p_RecvMemberUpdateDto, true);
                    //if (strReturn_ == string.Empty)
                    //{
                    //    return StatusCode(HttpStatusCode.NoContent);
                    //}
                    //else
                    //{
                    //    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, strReturn_));
                    //}
                    if (status_ == MessageStatus.None)  //0沒有任何錯誤
                    {
                        return StatusCode(HttpStatusCode.NoContent);
                    }
                    else
                    {
                        //MessageStatus回傳文字狀態
                        return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, status_.ToString()));
                        //MessageStatus回傳0123狀態
                        //return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, Convert.ToInt32(status_).ToString()));
                    }

                }
                else
                {
                    var _errMsg = ModelState.Values.Where(x => x.Errors.Count > 0)?.FirstOrDefault()?.Errors.Select(y => y.ErrorMessage).FirstOrDefault();
                    return Content(HttpStatusCode.BadRequest, _errMsg);
                }
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        //[Route("MemberAdmin/ChangePassword")]
        [HttpPatch]
        /// <summary>
        /// 管理者更改會員密碼
        /// </summary>
        /// <param name="p_RecvMemberPasswordDto"> 更新的會員密碼 </param>
        /// <returns></returns>
        public IHttpActionResult ChangePassword(Guid id,[FromBody] RecvMemberPasswordDto p_RecvMemberPasswordDto)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    string strReturn_ = string.Empty;

                    strReturn_ = m_IMemberService.ChangePassword(id, p_RecvMemberPasswordDto, true);

                    if (strReturn_ == string.Empty)
                    {
                        return StatusCode(HttpStatusCode.NoContent);
                    }
                    else
                    {
                        return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, strReturn_));
                    }
                }
                else
                {
                    var _errMsg = ModelState.Values.Where(x => x.Errors.Count > 0)?.FirstOrDefault()?.Errors.Select(y => y.ErrorMessage).FirstOrDefault();
                    return Content(HttpStatusCode.BadRequest, _errMsg);
                }
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

    }
}