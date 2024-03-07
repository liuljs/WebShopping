using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Data;
using ecSqlDBManager;
using System.Data.SqlClient;
using System.Security.Cryptography;
using System.Web.Security;
using System.Text;
using WebShopping.Auth;
using WebShopping.Helpers;

namespace WebShoppingAdmin.Models
{
    public class Manager : BaseModel
    {        
        public DataTable Get(Guid? id)
        {
            SqlCommand sql = new SqlCommand(string.Format(@"
            SELECT
                A.[ID], A.[ACCOUNT], A.[EMAIL], A.[NAME], A.[ENABLED], A.[LASTLOGINED]
            FROM[MANAGER] A WHERE A.[ACCOUNT] <> 'admin' {0}             
            ORDER BY A.[NAME]", id == null ? "AND DELETED = 'N'" : "AND A.[ID] = @MANAGER_ID"));

            if (id != null)
                sql.Parameters.AddWithValue("@MANAGER_ID", id); //管理者的id

            DataTable resultTop_ = db.GetResult(sql);
            resultTop_.Columns.Add("INFO", typeof(DataTable));
                        
            foreach (DataRow dr1 in resultTop_.Rows)
            {
                string strManagerId_ = dr1["ID"].ToString();

                sql = new SqlCommand(string.Format(@"
                SELECT
                    C.[NAME] AS GROUP_NAME, C.[ID] AS GROUP_ID
                FROM[MANAGER] A
                JOIN[LNK_MANAGER_GROUP] B ON A.[ID] = B.[MANAGER_ID]
                JOIN[MANAGER_GROUP] C ON C.[ID] = B.[MANAGER_GRP_ID] 
                WHERE A.[ID] = @MANAGER_ID"));
                sql.Parameters.AddWithValue("@MANAGER_ID", strManagerId_);
                DataTable resultMiddle_ = db.GetResult(sql);
                resultMiddle_.Columns.Add("DATA", typeof(DataTable));

                foreach (DataRow dr2 in resultMiddle_.Rows)
                {
                    sql = new SqlCommand(@"
                    SELECT DISTINCT D.[CODE], D.[ACT_ADD], D.[ACT_DEL], D.[ACT_EDT]
                    FROM [LNK_MANAGER_GROUP] A 
                    JOIN [LNK_MODULE] C ON C.[MANAGER_GRP_ID] = A.[MANAGER_GRP_ID]
                    JOIN [MODULE] D ON D.[ID] = C.[MODULE_ID]
                    WHERE A.[MANAGER_ID] = @ID
                    ORDER BY D.[CODE]");

                    sql.Parameters.AddWithValue("@ID", strManagerId_);
                    DataTable resultSub_ = db.GetResult(sql);

                    dr2["DATA"] = resultSub_;                    
                }

                if (resultMiddle_.Rows.Count > 0)
                    dr1["INFO"] = resultMiddle_;
            }

            return resultTop_;
        }

        public void Insert(ManagerInsertParam param)
        {
            try
            {
                db.OpenConn();

                SqlCommand sql = new SqlCommand(@"
                SELECT [ID] FROM [MANAGER] WHERE [ACCOUNT] = @ACCOUNT");
                sql.Parameters.AddWithValue("@ACCOUNT", param.account);
                DataTable dt = db.GetResult(sql);

                if (dt.Rows.Count > 0)
                    throw new Exception("已經有相同的管理帳號");

                sql = new SqlCommand(@"
                SELECT [ID] FROM [MANAGER] WHERE [EMAIL] = @EMAIL");
                sql.Parameters.AddWithValue("@EMAIL", param.email);
                DataTable dt1 = db.GetResult(sql);

                if (dt.Rows.Count > 0)
                    throw new Exception("已經有相同的註冊信箱");
                              
                string strSalt_ = Tools.GetInstance().CreateSaltCode(); //產生雜湊碼
                string strRandomPW_ = Tools.GetInstance().CreateRandomCode(10); //隨機取得密碼

                string pwd = BitConverter.ToString(SHA1.Create().ComputeHash(Encoding.UTF8.GetBytes($"{strRandomPW_}{strSalt_}"))).Replace("-", null);
                //string pwd = BitConverter.ToString(SHA1.Create().ComputeHash(Encoding.UTF8.GetBytes($"{param.account}{salt}"))).Replace("-", null);
                //string pwd = FormsAuthentication.HashPasswordForStoringInConfigFile(param.account + salt, "SHA1");

                // 主檔
                sql = new SqlCommand(@"
                INSERT INTO [MANAGER] ([ID], [ACCOUNT], [EMAIL], [NAME], [PASSWORD], [PWD_SALT], [STATUS])
                VALUES (@ID, @ACCOUNT, @EMAIL, @NAME, @PASSWORD, @PWD_SALT, @STATUS)");
                sql.Parameters.AddWithValue("@ID", param.account_id);
                sql.Parameters.AddWithValue("@ACCOUNT", param.account);
                sql.Parameters.AddWithValue("@EMAIL", param.email);
                sql.Parameters.AddWithValue("@NAME", param.name);
                sql.Parameters.AddWithValue("@PASSWORD", pwd);
                sql.Parameters.AddWithValue("@PWD_SALT", strSalt_);
                sql.Parameters.AddWithValue("@STATUS", (int)RoleType.Admin);
                db.ExecuteNonCommit(sql);

                // 群組關連
                if (param.groups != null)
                {
                    sql = new SqlCommand(@"
                    INSERT INTO [LNK_MANAGER_GROUP] ([MANAGER_ID], [MANAGER_GRP_ID])
                    VALUES (@MANAGER_ID, @MANAGER_GRP_ID)");
                    foreach (string groupId in param.groups)
                    {
                        sql.Parameters.Clear();
                        sql.Parameters.AddWithValue("@MANAGER_ID", param.account_id);
                        sql.Parameters.AddWithValue("@MANAGER_GRP_ID", groupId);
                        db.ExecuteNonCommit(sql);
                    }
                }

                EventLog(db, "manager&lnk", DbAction.INSERT, param.account_id, null, param);

                db.Commit();
                db.CloseConn();

                //發送Email
                SystemFunctions.SendMail(Tools.Company_Name, Tools.Admin_Mail, param.email, new List<string>(), new List<string>(), 
                                             $"{Tools.Company_Name}密碼訊息通知", $"預設密碼 : {strRandomPW_}, 請至 {WebShopping.Helpers.Tools.WebSiteUrl}/backStage/login.html 更改密碼");
            }
            catch (Exception ex)
            {
                if (db.SqlConn.State != ConnectionState.Closed)
                    db.CloseConn();

                throw ex;
            }
        }

        public void Update(ManagerUpdateParam param)
        {
            try
            {
                db.OpenConn();

                // 取得舊資料
                DataTable oldData, oldGroupData;
                GetOldData(param.account_id, out oldData, out oldGroupData);

                // 主檔
                SqlCommand sql = new SqlCommand(@"
                UPDATE [MANAGER] SET [EMAIL] = @EMAIL, [NAME] = @NAME, [ENABLED] = @ENABLED
                WHERE ID = @ID");
                sql.Parameters.AddWithValue("@ID", param.account_id);
                sql.Parameters.AddWithValue("@EMAIL", param.email);
                sql.Parameters.AddWithValue("@NAME", param.name);
                sql.Parameters.AddWithValue("@ENABLED", param.enabled);
                db.ExecuteNonCommit(sql);

                // 重新群組關連
                sql = new SqlCommand(@"
                DELETE FROM [LNK_MANAGER_GROUP] WHERE [MANAGER_ID] = @MANAGER_ID");
                sql.Parameters.AddWithValue("@MANAGER_ID", param.account_id);
                db.ExecuteNonCommit(sql);

                if (param.groups != null)
                {
                    sql = new SqlCommand(@"
                    INSERT INTO [LNK_MANAGER_GROUP] ([MANAGER_ID], [MANAGER_GRP_ID])
                    VALUES (@MANAGER_ID, @MANAGER_GRP_ID)");
                    foreach (string groupId in param.groups)
                    {
                        sql.Parameters.Clear();
                        sql.Parameters.AddWithValue("@MANAGER_ID", param.account_id);
                        sql.Parameters.AddWithValue("@MANAGER_GRP_ID", groupId);
                        db.ExecuteNonCommit(sql);
                    }
                }

                EventLog(db, "manager&lnk", DbAction.UPDATE, param.account_id, new { master = oldData, lnk = oldGroupData }, param);

                db.Commit();
                db.CloseConn();
            }
            catch (Exception ex)
            {
                if (db.SqlConn.State != ConnectionState.Closed)
                    db.CloseConn();

                throw ex;
            }
        }

        public void Delete(ManagerDeleteParam param)
        {
            try
            {
                db.OpenConn();

                // 取得舊資料
                DataTable oldData, oldGroupData;
                GetOldData(param.id, out oldData, out oldGroupData);

                // 主檔(這個主檔不會刪，不然EventLog會找不到兇手)
                SqlCommand sql = new SqlCommand(@"
                UPDATE [MANAGER] SET [DELETED] = @DELETED
                WHERE ID = @ID");
                sql.Parameters.AddWithValue("@ID", param.id);
                sql.Parameters.AddWithValue("@DELETED", 'Y');
                db.ExecuteNonCommit(sql);

                // 刪除群組關連(如果真的誤刪就誤刪了，回覆後重新給予關連吧)
                sql = new SqlCommand(@"
                DELETE FROM [LNK_MANAGER_GROUP] WHERE [MANAGER_ID] = @MANAGER_ID");
                sql.Parameters.AddWithValue("@MANAGER_ID", param.id);
                db.ExecuteNonCommit(sql);

                EventLog(db, "manager&lnk", DbAction.DELETE, param.account_id, new { master = oldData, lnk = oldGroupData }, null);

                db.Commit();
                db.CloseConn();
            }
            catch (Exception ex)
            {
                if (db.SqlConn.State != ConnectionState.Closed)
                    db.CloseConn();

                throw ex;
            }
        }

        public string UpdatePassword(ManagerUpdatePassWordParam param)
        {
            try
            {
                //結果字串回傳
                string strResult_ = string.Empty;

                //取得 ASP.NET 使用者
                var user_ = HttpContext.Current.User;

                //是否通過驗證
                if (user_?.Identity?.IsAuthenticated == true)
                {
                    //取得 FormsIdentity
                    var identity = (FormsIdentity)user_.Identity;

                    //取得 FormsAuthenticationTicket
                    var ticket = identity.Ticket;

                    //管理者Id
                    string strManagerId_ = ticket.Name;

                    db.OpenConn();

                    // 取得舊資料
                    SqlCommand sql = new SqlCommand(@"
                        SELECT
                            [ID], [NAME], [ACCOUNT], [PASSWORD], [PWD_SALT], [CREATE_DATE], [EMAIL]
                        FROM [MANAGER]
                        WHERE [ID] = @ID");                    
                    sql.Parameters.AddWithValue("@ID", strManagerId_);
                    DataTable oldData_ = db.GetResult(sql);

                    //比對密碼是否相同
                    if (oldData_.Rows.Count > 0)
                    {
                        string strCurrentPwd_ = oldData_.Rows[0]["PASSWORD"].ToString();
                        string strEncryptPwd_ = $"{param.old_password}{oldData_.Rows[0]["PWD_SALT"]}";    //雜湊碼(輸入的舊密碼 + 雜湊值)
                        string strInputOldPwd_ = BitConverter.ToString(SHA1.Create().ComputeHash(Encoding.UTF8.GetBytes(strEncryptPwd_))).Replace("-", null);

                        //現有密碼 = 輸入的舊密碼
                        if (strCurrentPwd_ == strInputOldPwd_)
                        {
                            //輸入的新密碼 = 再次輸入的新密碼
                            if (param.new_password == param.new_password_again)
                            {
                                string strUpdateEncryptPwd_ = $"{param.new_password}{oldData_.Rows[0]["PWD_SALT"]}";    //雜湊碼(輸入的新密碼 + 雜湊值)
                                string strUpdatePwd_ = BitConverter.ToString(SHA1.Create().ComputeHash(Encoding.UTF8.GetBytes(strUpdateEncryptPwd_))).Replace("-", null);

                                //密碼更新
                                sql = new SqlCommand(@"
                                UPDATE [MANAGER] SET [PASSWORD] = @PASSWORD
                                WHERE ID = @ID");
                                sql.Parameters.AddWithValue("@PASSWORD", strUpdatePwd_);
                                sql.Parameters.AddWithValue("@ID", strManagerId_);
                                db.ExecuteNonCommit(sql);

                                EventLog(db, "manager", DbAction.UPDATE, Guid.Parse(strManagerId_), new { master = oldData_ }, param);
                            }
                            else
                            {
                                SystemFunctions.WriteLogFile($"[UpdatePassword]-[二次密碼不相同]-[Account : {oldData_.Rows[0]["ACCOUNT"]}]-[Password : {param.new_password}]-[Again Password : {param.new_password_again}]");
                                strResult_ = "二次密碼不相同";
                            }
                        }
                        else
                        {
                            SystemFunctions.WriteLogFile($"[UpdatePassword]-[帳號或密碼錯誤]-[Account : {oldData_.Rows[0]["ACCOUNT"]}]-[Password : {param.old_password}]");
                            strResult_ = "帳號或密碼錯誤";
                        }
                    }                                      
                }
                
                db.Commit();
                db.CloseConn();

                return strResult_;
            }
            catch(Exception ex)
            {
                if (db.SqlConn.State != ConnectionState.Closed)
                    db.CloseConn();

                throw ex;
            }            
        }

        public string ResetPassword(ManagerResetPassWordParam param)
        {
            try
            {
                //結果字串回傳
                string strResult_ = string.Empty;

                //取得 ASP.NET 使用者
                var user_ = HttpContext.Current.User;

                //是否通過驗證
                if (user_?.Identity?.IsAuthenticated == true)
                {
                    ////取得 FormsIdentity
                    //var identity = (FormsIdentity)user_.Identity;

                    ////取得 FormsAuthenticationTicket
                    //var ticket = identity.Ticket;

                    ////管理者Id
                    string strManagerId_ = param.id.ToString();

                    db.OpenConn();

                    // 取得舊資料
                    SqlCommand sql = new SqlCommand(@"
                        SELECT
                            [ID], [NAME], [ACCOUNT], [PASSWORD], [PWD_SALT], [CREATE_DATE], [EMAIL]
                        FROM [MANAGER]
                        WHERE [ID] = @ID");
                    sql.Parameters.AddWithValue("@ID", strManagerId_);
                    DataTable oldData_ = db.GetResult(sql);

                    //資料存在
                    if (oldData_.Rows.Count > 0)
                    {
                        //輸入的新密碼 = 再次輸入的新密碼
                        if (param.new_password == param.new_password_again)
                        {
                            string strUpdateEncryptPwd_ = $"{param.new_password}{oldData_.Rows[0]["PWD_SALT"]}";    //雜湊碼(輸入的新密碼 + 雜湊值)
                            string strUpdatePwd_ = BitConverter.ToString(SHA1.Create().ComputeHash(Encoding.UTF8.GetBytes(strUpdateEncryptPwd_))).Replace("-", null);

                            //密碼更新
                            sql = new SqlCommand(@"
                                UPDATE [MANAGER] SET [PASSWORD] = @PASSWORD
                                WHERE ID = @ID");
                            sql.Parameters.AddWithValue("@PASSWORD", strUpdatePwd_);
                            sql.Parameters.AddWithValue("@ID", strManagerId_);
                            db.ExecuteNonCommit(sql);

                            EventLog(db, "manager", DbAction.UPDATE, Guid.Parse(strManagerId_), new { master = oldData_ }, param);
                        }
                        else
                        {
                            SystemFunctions.WriteLogFile($"[UpdatePassword]-[二次密碼不相同]-[Account : {oldData_.Rows[0]["ACCOUNT"]}]-[Password : {param.new_password}]-[Again Password : {param.new_password_again}]");
                            strResult_ = "二次密碼不相同";
                        }
                    }
                }

                db.Commit();
                db.CloseConn();

                return strResult_;
            }
            catch (Exception ex)
            {
                if (db.SqlConn.State != ConnectionState.Closed)
                    db.CloseConn();

                throw ex;
            }
        }

        /// <summary>
        /// 回拋舊資料
        /// </summary>
        private void GetOldData(Guid managerId, out DataTable oldData, out DataTable oldGroupData)
        {
            SqlCommand sql = new SqlCommand(@"
                SELECT
                    [ID], [EMAIL], [NAME], [ENABLED]
                FROM [MANAGER]
                WHERE [ID] = @ID");
            sql.Parameters.AddWithValue("@ID", managerId);

            oldData = db.GetResult(sql);

            sql = new SqlCommand(@"
                SELECT
                    [MANAGER_ID], [MANAGER_GRP_ID]
                FROM [LNK_MANAGER_GROUP]
                WHERE [MANAGER_ID] = @MANAGER_ID");
            sql.Parameters.AddWithValue("@MANAGER_ID", managerId);

            oldGroupData = db.GetResult(sql);
        }
    }

    public class ManagerDeleteParam
    {
        /// <summary>
        /// 登入帳號ID
        /// </summary>
        [Required]
        public Guid account_id { get; set; }
        /// <summary>
        /// 管理帳號ID
        /// </summary>
        [Required]
        public Guid id { get; set; }
    }

    public class ManagerInsertParam 
    {
        /// <summary>
        /// 登入帳號ID
        /// </summary>
        //[Required]
        public Guid account_id { get; set; }
        ///// <summary>
        ///// 管理群組ID
        ///// </summary>        
        //public Guid id { get; set; }
        /// <summary>
        /// 管理帳號
        /// </summary>
        [Required, StringLength(20), RegularExpression(@"[A-Za-z0-9]+")]
        public string account { get; set; }
        /// <summary>
        /// 帳號名稱
        /// </summary>
        [Required, StringLength(30)]
        public string name { get; set; }
        /// <summary>
        /// 帳號郵件
        /// </summary>
        [Required, StringLength(50), EmailAddress]
        public string email { get; set; }
        /// <summary>
        /// 群組ID陣列
        /// </summary>
        public string[] groups { get; set; }
    }

    public class ManagerUpdateParam : ManagerInsertParam
    {
        /// <summary>
        /// 是否啟用
        /// </summary>        
        public byte enabled { get; set; }
    }

    /// <summary>
    /// 更新密碼
    /// </summary>
    public class ManagerUpdatePassWordParam
    {
        /// <summary>
        /// 舊密碼
        /// </summary>                
        [Required, StringLength(100)]
        public string old_password { get; set; }

        /// <summary>
        /// 新密碼
        /// </summary>        
        [Required, StringLength(100)]
        public string new_password { get; set; }

        /// <summary>
        /// 新密碼(Again)
        /// </summary>        
        [Required, StringLength(100)]
        public string new_password_again { get; set; }
    }

    /// <summary>
    /// 重設密碼
    /// </summary>
    public class ManagerResetPassWordParam
    {
        /// <summary>
        /// 管理員ID
        /// </summary>        
        public Guid id { get; set; }

        /// <summary>
        /// 新密碼
        /// </summary>        
        [Required, StringLength(100)]
        public string new_password { get; set; }

        /// <summary>
        /// 新密碼(Again)
        /// </summary>        
        [Required, StringLength(100)]
        public string new_password_again { get; set; }
    }
}