using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Data;
using ecSqlDBManager;
using System.Data.SqlClient;

namespace WebShoppingAdmin.Models
{
    public class ManagerGroup : BaseModel
    {
        public DataTable Get(Guid? id)
        {
            SqlCommand sql = new SqlCommand(string.Format(@"
            SELECT [ID], [NAME]
            FROM [MANAGER_GROUP]        
            WHERE [NAME] <> 'Admin' 
            {0} 
            ORDER BY [NAME]", id == null ? "" : "AND [ID] = @ID"));
            if (id != null)
                sql.Parameters.AddWithValue("@ID", id);
            DataTable result = db.GetResult(sql);
            result.Columns.Add("DATA", typeof(DataTable));

            foreach (DataRow dr in result.Rows)
            {
                string _managerGroupId = dr["id"].ToString();

                sql = new SqlCommand(string.Format(@"
                SELECT [B].[CODE],[B].[NAME],[B].[ACT_VIEW],[B].[ACT_EDT],[B].[ACT_DEL]
                FROM [LNK_MODULE] A
                LEFT JOIN [MODULE] B
                ON A.MODULE_ID = B.ID
                WHERE [A].[MANAGER_GRP_ID] = @ID"));

                sql.Parameters.AddWithValue("@ID", _managerGroupId);
                DataTable _subDataTable = db.GetResult(sql);

                dr["DATA"] = _subDataTable;
            }

            return result;
        }

        public void Insert(ManagerGroupInsertParam param)
        {
            try
            {
                db.OpenConn();

                //param.id = Guid.NewGuid(); //新增的群組ID
                param.name = param.name.Trim();

                SqlCommand sql = new SqlCommand(@"
                SELECT [NAME] FROM [MANAGER_GROUP] WHERE [NAME] = @NAME");
                sql.Parameters.AddWithValue("@NAME", param.name);
                DataTable dt = db.GetResult(sql);

                if (dt.Rows.Count > 0)
                    throw new Exception("已經有相同名稱的管理群組");

                sql = new SqlCommand(@"
                INSERT INTO [MANAGER_GROUP] ([ID], [NAME])
                VALUES (@ID, @NAME)");
                sql.Parameters.AddWithValue("@ID", param.id);
                sql.Parameters.AddWithValue("@NAME", param.name);

                db.ExecuteNonCommit(sql);

                for (int i = 0; i < param.Data.Count; i++)
                {
                    Guid _moduleId = Guid.NewGuid();

                    sql = new SqlCommand(@"
                    INSERT INTO [MODULE] ([ID], [CODE],[NAME],[ACT_VIEW],[ACT_EDT],[ACT_DEL])
                    VALUES (@ID, @CODE, @NAME, @ACT_VIEW, @ACT_EDT, @ACT_DEL)");
                    sql.Parameters.AddWithValue("@ID", _moduleId);
                    sql.Parameters.AddWithValue("@CODE", param.Data[i].Code);
                    sql.Parameters.AddWithValue("@NAME", param.Data[i].Name);
                    sql.Parameters.AddWithValue("@ACT_VIEW", param.Data[i].act_view);
                    sql.Parameters.AddWithValue("@ACT_EDT", param.Data[i].act_edt);
                    sql.Parameters.AddWithValue("@ACT_DEL", param.Data[i].act_del);

                    db.ExecuteNonCommit(sql);

                    sql = new SqlCommand(@"
                    INSERT INTO [LNK_MODULE] ([MANAGER_GRP_ID], [MODULE_ID])
                    VALUES (@MANAGER_GRP_ID, @MODULE_ID)");
                    sql.Parameters.AddWithValue("@MANAGER_GRP_ID", param.id);
                    sql.Parameters.AddWithValue("@MODULE_ID", _moduleId);

                    db.ExecuteNonCommit(sql);
                }

                EventLog(db, "manager_group", DbAction.INSERT, param.account_id, null, param);

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

        public void Update(ManagerGroupUpdateParam param)
        {
            try
            {
                db.OpenConn();

                param.name = param.name.Trim();

                SqlCommand sql = new SqlCommand(@"
                SELECT [NAME]
                FROM [MANAGER_GROUP]                
                WHERE [ID] = @ID");
                sql.Parameters.AddWithValue("@ID", param.id);   //管理群組id

                DataTable dt = db.GetResult(sql);

                if (dt.Rows.Count == 0)
                    throw new Exception($"無此管理群組");

                sql = new SqlCommand(@"
                SELECT [ID], [NAME]
                FROM [MANAGER_GROUP]
                WHERE [ID] = @ID");
                sql.Parameters.AddWithValue("@ID", param.id);

                DataTable oldData = db.GetResult(sql);

                sql = new SqlCommand(@"
                    SELECT A.[ID],A.[CODE]
                    FROM [MODULE] A
                    JOIN [LNK_MODULE] B
                    ON A.[ID] = B.MODULE_ID
                    WHERE B.[MANAGER_GRP_ID] = @ID");
                sql.Parameters.AddWithValue("@ID", param.id); //群組ID

                DataTable _refTable = db.GetResult(sql); //取得應權限ID的對應的CODE

                sql = new SqlCommand(@"
                UPDATE [MANAGER_GROUP] SET
                    [NAME] = @NAME
                WHERE [ID] = @ID");
                sql.Parameters.AddWithValue("@NAME", param.name);
                sql.Parameters.AddWithValue("@ID", param.id);

                db.ExecuteNonCommit(sql);

                foreach (DataRow dr in _refTable.Rows)
                {
                    string _moduleId = dr["id"].ToString();
                    string _code = dr["code"].ToString();

                    var _module = param.Data.Where(x => x.Code == _code).FirstOrDefault();

                    if (_module != null)
                    {
                        sql = new SqlCommand(@"
                        UPDATE [MODULE] 
                        SET [CODE] = @CODE,[NAME]=@NAME,[ACT_VIEW]=@ACT_VIEW,[ACT_EDT]=@ACT_EDT,[ACT_DEL]=@ACT_DEL
                        WHERE ID = @ID");
                        sql.Parameters.AddWithValue("@ID", _moduleId);
                        sql.Parameters.AddWithValue("@CODE", _module.Code);
                        sql.Parameters.AddWithValue("@NAME", _module.Name);
                        sql.Parameters.AddWithValue("@ACT_VIEW", _module.act_view);
                        sql.Parameters.AddWithValue("@ACT_EDT", _module.act_edt);
                        sql.Parameters.AddWithValue("@ACT_DEL", _module.act_del);

                        db.ExecuteNonCommit(sql);
                    }
                }

                EventLog(db, "manager_group", DbAction.UPDATE, param.account_id, oldData, param);

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

        public void Delete(ManagerGroupDeleteParam param)
        {
            try
            {
                db.OpenConn();

                //撈出 MANAGER_GROUP 表
                SqlCommand sql = new SqlCommand(@"
                SELECT
                    [ID], [NAME]
                FROM [MANAGER_GROUP]
                WHERE [ID] = @GROUP_ID");
                sql.Parameters.AddWithValue("@GROUP_ID", param.id); //群組ID
                DataTable oldData = db.GetResult(sql);

                //刪除 MANAGER_GROUP 資料
                sql = new SqlCommand(@"
                DELETE FROM [MANAGER_GROUP]
                WHERE [ID] = @GROUP_ID");
                sql.Parameters.AddWithValue("@GROUP_ID", param.id); //群組ID
                db.ExecuteNonCommit(sql);

                //撈出 LNK_MANAGER_GROUP 表
                sql = new SqlCommand(@"
                SELECT [MANAGER_ID], [MANAGER_GRP_ID] 
                FROM[LNK_MANAGER_GROUP] 
                WHERE [MANAGER_GRP_ID] = @GROUP_ID");
                sql.Parameters.AddWithValue("@GROUP_ID", param.id); //群組ID
                DataTable oldLnkManagerGroupData = db.GetResult(sql);

                //刪除 LNK_MANAGER_GROUP 資料
                sql = new SqlCommand(@"
                DELETE FROM[LNK_MANAGER_GROUP]                 
                WHERE [MANAGER_GRP_ID] = @GROUP_ID");
                sql.Parameters.AddWithValue("@GROUP_ID", param.id); //群組ID
                db.ExecuteNonCommit(sql);

                //撈出 MODULE 表
                sql = new SqlCommand(@"
                SELECT * FROM [MODULE] 
                WHERE [id] = @GROUP_ID");
                sql.Parameters.AddWithValue("@GROUP_ID", param.id); //群組ID
                DataTable oldModuleData = db.GetResult(sql);

                //刪除 MODULE 資料
                sql = new SqlCommand(@"
				DELETE B
                FROM [LNK_MODULE] A
                LEFT JOIN [MODULE] B
                ON A.MODULE_ID = B.ID
                WHERE [A].[MANAGER_GRP_ID] = @GROUP_ID");
                sql.Parameters.AddWithValue("@GROUP_ID", param.id); //群組ID
                db.ExecuteNonCommit(sql);

                //撈出 LNK_MODULE 表
                sql = new SqlCommand(@"
                SELECT [MANAGER_GRP_ID], [MODULE_ID] 
                FROM [LNK_MODULE] 
                WHERE [MANAGER_GRP_ID] = @GROUP_ID");
                sql.Parameters.AddWithValue("@GROUP_ID", param.id); //群組ID
                DataTable oldLnkModuleData = db.GetResult(sql);

                //刪除 LNK_MODULE 資料
                sql = new SqlCommand(@"
                DELETE [LNK_MODULE]	
                WHERE [MANAGER_GRP_ID] = @GROUP_ID");
                sql.Parameters.AddWithValue("@GROUP_ID", param.id); //群組ID
                db.ExecuteNonCommit(sql);

                EventLog(db, "manager_group", DbAction.DELETE, param.account_id, oldData, null);

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

        public void UpdateLnk(ManagerGroupLnkParam param)
        {
            try
            {
                db.OpenConn();

                SqlCommand sql = new SqlCommand(@"
                SELECT
                    [MANAGER_GRP_ID], [MODULE_ID]
                FROM [LNK_MODULE]
                WHERE [MANAGER_GRP_ID] = @MANAGER_GRP_ID");
                sql.Parameters.AddWithValue("@MANAGER_GRP_ID", param.group_id);

                DataTable oldData = db.GetResult(sql);

                sql = new SqlCommand(@"
                DELETE FROM [LNK_MODULE]
                WHERE [MANAGER_GRP_ID] = @MANAGER_GRP_ID");
                sql.Parameters.AddWithValue("@MANAGER_GRP_ID", param.group_id);

                db.ExecuteNonCommit(sql);

                if (param.modules != null)
                {
                    sql = new SqlCommand(@"
                    INSERT INTO [LNK_MODULE] ([MANAGER_GRP_ID], [MODULE_ID])
                    VALUES (@MANAGER_GRP_ID, @MODULE_ID)");
                    foreach (var m in param.modules)
                    {
                        sql.Parameters.Clear();
                        sql.Parameters.AddWithValue("@MANAGER_GRP_ID", param.group_id);
                        sql.Parameters.AddWithValue("@MODULE_ID", m);

                        db.ExecuteNonCommit(sql);
                    }
                }

                EventLog(db, "lnk_module", DbAction.UPDATE, param.account_id, oldData, param);

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
    }

    public class ManagerGroupLnkParam
    {
        /// <summary>
        /// 管理帳號ID
        /// </summary>
        [Required]
        public Guid account_id { get; set; }
        /// <summary>
        /// 管理群組ID
        /// </summary>
        [Required]
        public Guid group_id { get; set; }
        /// <summary>
        /// 模組ID
        /// </summary>
        public Guid[] modules { get; set; }
    }

    public class ManagerGroupDeleteParam
    {
        /// <summary>
        /// 管理帳號ID
        /// </summary>
        [Required(ErrorMessage = "帳號ID必填")]
        public Guid account_id { get; set; }
        /// <summary>
        /// 管理群組ID
        /// </summary>
        [Required(ErrorMessage = "群組ID必填")]
        public Guid id { get; set; }
    }

    public class ManagerGroupInsertParam
    {
        /// <summary>
        /// 管理帳號ID
        /// </summary>
        [Required]
        public Guid account_id { get; set; }

        /// <summary>
        /// 管理群組ID
        /// </summary>        
        public Guid id { get; set; }

        /// <summary>
        /// 群組名稱
        /// </summary>
        [Required, StringLength(20)]
        public string name { get; set; }

        [Required]
        public List<Module> Data { get; set; }
    }

    public class ManagerGroupUpdateParam : ManagerGroupDeleteParam
    {
        /// <summary>
        /// 群組名稱
        /// </summary>
        [Required, StringLength(20)]
        public string name { get; set; }

        [Required]
        public List<Module> Data { get; set; }
    }

    public class ManagerGroupGetParam
    {
        public Guid id { get; set; }
    }
}