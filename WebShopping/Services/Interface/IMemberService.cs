﻿using WebShopping.Dtos;
using WebShopping.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebShopping.Services
{
    public interface IMemberService
    {
        Member GetMember(Guid id);                          //取得指定會員資料
        List<Member> GetMembers(int? count, int? page);                          //取得所有會員
        void DeleteMember(Guid id);                         //刪除指定會員
        MessageStatus AddMember(RecvMemberAddDto addDto, bool isAdmin); //新增會員([isAdmin] : 是否為後台)
        //int AddFBMember(RecvMemberAddDto p_RecvMemberAddDto);//FB登入自動新增會員
        MessageStatus UpdateMember(Guid id, RecvMemberUpdateDto UpdateDto, bool isAdmin); //更新會員([isAdmin] : 是否為後台)
        string ChangePassword(Guid id, RecvMemberPasswordDto UpdateDto, bool isAdmin); //更新會員密碼([isAdmin] : 是否為後台)
        string ForgetPassword(RecvForgetPasswordDto p_RecvForgetPasswordDto); //忘記會員密碼
        string AddWish(WishReceiveDto wish);// 加入追踪清單
        List<WishReturnDto> GetWish(WishReceiveDto wish);//取得所有追踪清單
        int DeleteWish(WishReceiveDto wish);//刪除指定追踪清單
        int DeleteAllWish(WishReceiveDto wish);//刪除全部追踪清單
    }
}