using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebShopping.Models
{
    public enum OpenStatus
    {
        Close,
        Open
    }

    public enum MessageStatus
    {
        None  ,                      //0都沒有問題
        RepeatAccount ,     //1已經有相同的帳號
        RepeatPhone  ,       //2已經有相同的手機號碼
        NoSuchAccount      //3查無此帳號，更新會員資訊先查資料庫是否有此會員
    }
}