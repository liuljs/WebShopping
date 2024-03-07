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
    public class FAQService : IFAQService
    {
        private IImageFileHelper m_ImageFileHelper;

        private IDapperHelper m_DapperHelper;

        //private string m_imageFolder = @"\Admin\backStage\img\faq\";

        public FAQService(IImageFileHelper imageFileHelper, IDapperHelper dapperHelper)
        {
            m_ImageFileHelper = imageFileHelper;
            m_DapperHelper = dapperHelper;
        }

        /// <summary>
        /// 取得單筆FAQ資料
        /// </summary>
        /// <param name="id">FAQID</param>
        /// <returns>單筆FAQ資料</returns>
        public FAQ GetFAQData(int id)
        {
            FAQ _faq = new FAQ();
            _faq.Id = id;

            string adminQuery = Auth.Role.IsAdmin ? "" : " AND Enabled=1 ";

            string _sql = $"SELECT * FROM [FAQ] WHERE [ID]=@ID {adminQuery} ORDER BY [Sort]";

            _faq = m_DapperHelper.QuerySqlFirstOrDefault(_sql, _faq);

            return _faq;
        }

        /// <summary>
        /// 取得全部FAQ資料
        /// </summary>
        /// <returns>全部FAQ資料</returns>
        public List<FAQ> GetFAQSetData()
        {
            string adminQuery = Auth.Role.IsAdmin ? "" : " WHERE Enabled=1 ";

            string _sql = $"SELECT * FROM [FAQ] {adminQuery} ORDER BY Sort";

            List<FAQ> _faq = m_DapperHelper.QuerySetSql<FAQ>(_sql).ToList();

            return _faq;
        }

        /// <summary>
        /// 新增FAQ
        /// </summary>
        /// <param name="request">用戶端的要求資訊</param>
        /// <returns>新增FAQ的資料</returns>
        public FAQ InsertFAQ(HttpRequest request)
        {
            FAQ _faq = SetInsertNewData(request);

            string _sql = @"INSERT INTO [FAQ] (Question, Asked, Sort, Enabled) VALUES (@Question,@Asked, @Sort, @Enabled)";

            m_DapperHelper.ExecuteSql(_sql, _faq);

            FAQ faq = m_DapperHelper.QuerySqlFirstOrDefault<FAQ>("Select top 1 id from [FAQ] Order by id desc");
            _faq.Id = faq.Id;

            return _faq;
        }

         /// <summary>
        /// 設置新增FAQ的資料
        /// </summary>
        /// <param name="request">用戶端的要求資訊</param>
        /// <returns>新增FAQ的資料</returns>
        private FAQ SetInsertNewData(HttpRequest request)
        {
            FAQ _faq = new FAQ();
            //_faq.Id = Guid.NewGuid(); //訊息的 id(流水號)
            _faq.Question = request.Form["question"]; //常見問題
            _faq.Asked = request.Form["asked"]; //問題回答
            _faq.Sort =Convert.ToInt32(request.Form["sort"]); //排序
            _faq.Enabled = Convert.ToByte(request.Form["enabled"]); //是否啟用(0/1)

            return _faq;
        }

        /// <summary>
        /// 更新單筆FAQ資料
        /// </summary>
        /// <param name="request">用戶端的要求資訊</param>
        /// <param name="faq">更新的資料類別</param>
        public void UpdateFAQ(HttpRequest request, FAQ faq)
        {
            faq.Question = request.Form["question"];
            faq.Asked = request.Form["asked"];
            faq.Sort = Convert.ToInt32(request.Form["sort"]);
            faq.Enabled = Convert.ToByte(request.Form["enabled"]);

            string _sql = $@"UPDATE [FAQ] 
                             SET [Question]=@Question,[Asked]=@Asked,[Sort]=@Sort,[Enabled]=@Enabled,[updated_date]=getdate() 
                             WHERE [ID] = @ID";

            m_DapperHelper.ExecuteSql(_sql, faq);
        }

        /// <summary>
        /// 刪除一筆FAQ
        /// </summary>
        /// <param name="id">FAQID</param>
        public void DeleteFAQ(FAQ faq)
        {
            string _sql = @"DELETE FROM [FAQ] WHERE ID = @ID";

            m_DapperHelper.ExecuteSql(_sql, faq);
        }
    }
}