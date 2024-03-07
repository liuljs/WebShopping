using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Security.Cryptography;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Text;
using WebShopping.Auth;

namespace WebShoppingAdmin.Models
{
    public class AuthAdmin : BaseAuth
    {   
        public bool Login(AuthParam param)
        {
            SqlCommand sql = new SqlCommand(@"SELECT [ID], [NAME], [PASSWORD], [PWD_SALT], [STATUS] FROM [MANAGER] WHERE [ACCOUNT] = @ACCOUNT AND DELETED = 'N' AND ENABLED = 1");
            sql.Parameters.AddWithValue("@ACCOUNT", param.account);
            DataTable dt = db.GetResult(sql);
            if (dt.Rows.Count > 0)
            {
                string id = dt.Rows[0]["ID"].ToString();
                string name = dt.Rows[0]["NAME"].ToString();
                string realPwd = dt.Rows[0]["PASSWORD"].ToString();
                string encryptPwd = $"{param.password}{dt.Rows[0]["PWD_SALT"]}";
                string pwd = BitConverter.ToString(SHA1.Create().ComputeHash(Encoding.UTF8.GetBytes(encryptPwd))).Replace("-", null);

                if (realPwd == pwd)
                {
                    sql = new SqlCommand("Update [MANAGER] SET lastlogined=getdate() WHERE [ID]=@ID");
                    sql.Parameters.AddWithValue("@ID", id);
                    try
                    {
                        db.OpenConn();
                        db.Execute(sql);
                    }
                    finally
                    {
                        db.CloseConn();
                    }
                    

                    sql = new SqlCommand(
                    @"SELECT DISTINCT B.[NAME]
                    FROM [LNK_MANAGER_GROUP] A 
                    JOIN [MANAGER_GROUP] B 
                    ON A.[MANAGER_GRP_ID] = B.[ID]                  
                    WHERE A.[MANAGER_ID] = @ID");
                    sql.Parameters.AddWithValue("@ID", id);
                    DataTable dtManagerGroup = db.GetResult(sql);

                    sql = new SqlCommand(
                    @"SELECT DISTINCT D.[CODE], D.[ACT_VIEW], D.[ACT_DEL], D.[ACT_EDT]
                    FROM [LNK_MANAGER_GROUP] A 
                    JOIN [LNK_MODULE] C ON C.[MANAGER_GRP_ID] = A.[MANAGER_GRP_ID]
                    JOIN [MODULE] D ON D.[ID] = C.[MODULE_ID]
                    WHERE A.[MANAGER_ID] = @ID
                    ORDER BY D.[CODE]");
                    sql.Parameters.AddWithValue("@ID", id);
                    DataTable dtModule = db.GetResult(sql);

                    dtModule = CombineGroupPermission(dtModule);                

                    string module = JsonConvert.SerializeObject(new
                    {
                        id = id,
                        name = name,
                        //groupName = (dtManagerGroup.Rows.Count > 0) ? dtManagerGroup.Rows[0]["name"] : string.Empty,
                        module = dtModule,
                        Identity = Role.GetIdentityRole(Convert.ToInt32(dt.Rows[0]["STATUS"]))
                    });

                    var ticket = new FormsAuthenticationTicket(
                    version: 1,
                    name: id, //可以放使用者Id
                    issueDate: DateTime.UtcNow,//現在UTC時間
                    expiration: DateTime.UtcNow.AddMinutes(30),//Cookie有效時間=現在時間往後+30分鐘
                    isPersistent: true,// 是否要記住我 true or false
                    userData: module, //可以放使用者角色名稱
                    cookiePath: FormsAuthentication.FormsCookiePath);

                    var encryptedTicket = FormsAuthentication.Encrypt(ticket); //把驗證的表單加密
                    var cookie = new HttpCookie(FormsAuthentication.FormsCookieName, encryptedTicket);
                    cookie.HttpOnly = true;
                    //cookie.Domain = HttpContext.Current.Request.UrlReferrer.DnsSafeHost;
                    cookie.Domain = HttpContext.Current.Request.Url.IdnHost;
                    cookie.Expires = DateTime.UtcNow.AddMinutes(30);
                    //cookie.SameSite = SameSiteMode.None;
                    //cookie.Secure = true;

                    HttpContext.Current.Response.Cookies.Add(cookie);

                    return true;
                }
                else
                    return false;
            }
            else
                return false;
        }
        
        /// <summary>
        /// 合併底下多群組的權限
        /// </summary>
        /// <param name="p_table"> 使用者接有的群組表單 </param>
        /// <returns></returns>
        private DataTable CombineGroupPermission(DataTable p_table)
        {
            //DataTable 轉 List
            List<PermissionParam> permissionList_ = new List<PermissionParam>();

            permissionList_ = (from DataRow dr in p_table.Rows
                           select new PermissionParam()
                           {
                               CODE = dr["CODE"].ToString(),
                               ACT_VIEW = dr["ACT_VIEW"].ToString(),
                               ACT_DEL = dr["ACT_DEL"].ToString(),
                               ACT_EDT = dr["ACT_EDT"].ToString()
                           }).ToList();


            //建立一個初始Table
            DataTable dtCombineModule_ = GetDefaultModule();

            //合併 MM OM PM SM 的群組權限是Y的情況
            foreach (var v in permissionList_)
            {

                if (v.ACT_VIEW == "Y")
                {
                    //加入 ["CODE'] 判斷式
                    IEnumerable<DataRow> rows_ = dtCombineModule_.Rows.Cast<DataRow>().Where(r => r["CODE"].ToString() == v.CODE);
                    //更新 [ACT_VIEW] 的Cell值("Y")
                    rows_.ToList().ForEach(r => r.SetField("ACT_VIEW", "Y"));
                }

                if (v.ACT_DEL == "Y")
                {
                    IEnumerable<DataRow> rows_ = dtCombineModule_.Rows.Cast<DataRow>().Where(r => r["CODE"].ToString() == v.CODE);
                    rows_.ToList().ForEach(r => r.SetField("ACT_DEL", "Y"));
                }

                if (v.ACT_EDT == "Y")
                {
                    IEnumerable<DataRow> rows_ = dtCombineModule_.Rows.Cast<DataRow>().Where(r => r["CODE"].ToString() == v.CODE);
                    rows_.ToList().ForEach(r => r.SetField("ACT_EDT", "Y"));
                }
            }

            return dtCombineModule_;
        }

        private DataTable GetDefaultModule()
        {
            DataTable _dtModule = new DataTable();
            _dtModule.Columns.Add("CODE", typeof(string));
            _dtModule.Columns.Add("ACT_VIEW", typeof(char));
            _dtModule.Columns.Add("ACT_DEL", typeof(char));
            _dtModule.Columns.Add("ACT_EDT", typeof(char));

            for (int i = 0; i < 4; i++)
            {
                DataRow _row = _dtModule.NewRow();

                switch (i)
                {
                    case 0:
                        _row["CODE"] = "MM";
                        break;
                    case 1:
                        _row["CODE"] = "OM";
                        break;
                    case 2:
                        _row["CODE"] = "PM";
                        break;
                    case 3:
                        _row["CODE"] = "SM";
                        break;
                }

                _row["ACT_VIEW"] = 'N';
                _row["ACT_DEL"] = 'N';
                _row["ACT_EDT"] = 'N';

                _dtModule.Rows.Add(_row);
            }
         
            return _dtModule;
        }

        private DataTable GetSuperAdminModule()
        {
            DataTable _dtModule = new DataTable();
            _dtModule.Columns.Add("CODE", typeof(string));
            _dtModule.Columns.Add("ACT_VIEW", typeof(char));
            _dtModule.Columns.Add("ACT_DEL", typeof(char));
            _dtModule.Columns.Add("ACT_EDT", typeof(char));

            for (int i = 0; i < 4; i++)
            {
                DataRow _row = _dtModule.NewRow();

                switch (i)
                {
                    case 0:
                        _row["CODE"] = "MM";
                        break;
                    case 1:
                        _row["CODE"] = "OM";
                        break;
                    case 2:
                        _row["CODE"] = "PM";
                        break;
                    case 3:
                        _row["CODE"] = "SM";
                        break;
                }

                _row["ACT_VIEW"] = 'Y';
                _row["ACT_DEL"] = 'Y';
                _row["ACT_EDT"] = 'Y';
            }

            return _dtModule;
        }

    }
   
    /// <summary>
    /// 權限類別
    /// </summary>
    public class PermissionParam
    {
        public string CODE { get; set; }
        public string ACT_VIEW { get; set; }
        public string ACT_DEL { get; set; }
        public string ACT_EDT { get; set; }

    }
}