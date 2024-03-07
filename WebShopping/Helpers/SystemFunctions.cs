using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Web;

namespace WebShopping.Helpers
{
    public class SystemFunctions
    {
        /// <summary>
        /// 發送Email
        /// </summary>
        /// <param name="p_strSenderName">送信人名稱</param>
        /// <param name="p_strSenderMail">送信人Email</param>
        /// <param name="p_strRecipient">收件人Email</param>     
        /// <param name="p_lstrCC">副本</param>
        /// <param name="p_lstrBCC">密件副本</param>
        /// <param name="p_strSubject">主題</param>
        /// <param name="p_strContent">內容</param>

        public static void SendMail(string p_strSenderName, string p_strSenderMail, string p_strRecipient, List<string> p_lstrCC, List<string> p_lstrBCC, string p_strSubject, string p_strContent)
        {
            //Tools.GetInstance().SendMail(Tools.Company_Name, Tools.Admin_Mail, "prosu@payware.com.tw", new List<string>(), new List<string>(), "營天下購物商城後台網站錯誤訊息通知", "測試中");

            SmtpClient client = new SmtpClient();
            client.Port = int.Parse(Tools.GetInstance().Mail_Port);
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.UseDefaultCredentials = false;
            client.Host = Tools.GetInstance().Mail_Host;
            client.Credentials = new System.Net.NetworkCredential(Tools.GetInstance().Smtp_Id, Tools.GetInstance().Smtp_Pw);

            MailMessage mail = new MailMessage(new MailAddress(p_strSenderMail, p_strSenderName).ToString(), p_strRecipient);

            //若有多個副本
            if (p_lstrCC.Count > 0)
            {
                for (int i = 0; i < p_lstrCC.Count; i++)
                    mail.CC.Add(p_lstrCC[i]);
            }

            //若有多個密件副本
            if (p_lstrBCC.Count > 0)
            {
                for (int i = 0; i < p_lstrCC.Count; i++)
                    mail.Bcc.Add(p_lstrBCC[i]);
            }

            mail.Subject = p_strSubject;
            mail.Body = p_strContent;
            mail.IsBodyHtml = true;
            client.Send(mail);
        }

        /// <summary>
        /// 寫記錄
        /// </summary>
        /// <param name="p_strContent"> 內容 </param>
        public static void WriteLogFile(string p_strContent)
        {
            string DIRNAME = AppDomain.CurrentDomain.BaseDirectory + @"\App_Data\Log\";
            string FILENAME = DIRNAME + DateTime.Now.ToString("yyyy-MM-dd") + ".txt";

            if (!Directory.Exists(DIRNAME))
                Directory.CreateDirectory(DIRNAME);

            if (!File.Exists(FILENAME))
            {
                File.Create(FILENAME).Close();
            }

            string strMsg_ = $"[{DateTime.Now.ToString("HH:mm:ss")}] ==> {p_strContent} {Environment.NewLine}";

            File.AppendAllText(FILENAME, strMsg_);
        }

        public static string ReadLogFile()
        {
            string DIRNAME = AppDomain.CurrentDomain.BaseDirectory + @"\App_Data\Log\";
            string FILENAME = DIRNAME + DateTime.Now.ToString("yyyy-MM-dd") + ".txt";
            string strMsg_ = string.Empty;

            if (!Directory.Exists(DIRNAME))
                Directory.CreateDirectory(DIRNAME);

            if (!File.Exists(FILENAME))
            {
                File.Create(FILENAME).Close();
            }

            strMsg_ = File.ReadAllText(FILENAME);

            return strMsg_;
        }
        public static void DeleteLogFile()
        {
            string DIRNAME = AppDomain.CurrentDomain.BaseDirectory + @"\App_Data\Log\";
            string FILENAME = DIRNAME + DateTime.Now.ToString("yyyy-MM-dd") + ".txt";
            string strMsg_ = string.Empty;

            if (!Directory.Exists(DIRNAME))
                Directory.CreateDirectory(DIRNAME);

            if (File.Exists(FILENAME))
            {
                File.Delete(FILENAME);
            }

        }

       public static string GetFormData(HttpRequest _request)
        {
            string str = "";
            str += "Request.Form<table border=1>";
            foreach (string k in _request.Form.Keys)
            {
                str += string.Format("<tr><td>{0}</td><td>{1}</td></tr>", k, HttpUtility.UrlDecode(_request.Form[k], Encoding.GetEncoding(950)));
            }
            str += "</table><br><br>";

            str += "Request.QueryString<table border=1>";
            foreach (string k in _request.QueryString.Keys)
            {
                str += string.Format("<tr><td>{0}</td><td>{1}</td></tr>", k, HttpUtility.UrlDecode(_request.QueryString[k], Encoding.GetEncoding(950)));
            }
            str += "</table><br><br>";


            return str;
        }

        public static string GetJsonData(HttpRequest _request)
        {
            string str = "";
            foreach (string k in _request.Form.Keys)
            {
                str += $"\t\"{k}\" : \"{HttpUtility.UrlDecode(_request.Form[k], Encoding.GetEncoding(950))}\",\n";
            }
            foreach (string k in _request.QueryString.Keys)
            {
                str += $"\t\"{k}\" : \"{HttpUtility.UrlDecode(_request.QueryString[k], Encoding.GetEncoding(950))}\",\n";
            }
            str =  str.Trim('\n').Trim(',');
            str = "{\n" + str.Trim(',') + "\n}";

            return str;
        }

        /// <summary>
        /// 向遠端伺服器要資料
        /// </summary>
        /// <param name="url"></param>
        /// <param name="data"></param>
        /// <param name="data"></param>
        /// <returns></returns>
        public static string RequestData(string url, string data, bool forTest, string method = "POST")
        {
            if (forTest) return "";//測試用

            if (method == "GET") {
                url = url + "?" + data;
                data = string.Empty;
            }
            byte[] postData = Encoding.GetEncoding("UTF-8").GetBytes(data);

            HttpWebRequest request = HttpWebRequest.Create(url) as HttpWebRequest;
            request.Method = method;    // 方法
            request.KeepAlive = true; //是否保持連線
            request.ContentType = "application/x-www-form-urlencoded";

            request.Credentials = CredentialCache.DefaultCredentials;
            ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3 | SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;

            if (method == "POST")
                using (Stream reqStream = request.GetRequestStream())
                {
                    reqStream.Write(postData, 0, postData.Length);
                }

            string result = string.Empty;
            try
            {
                using (WebResponse response = request.GetResponse())
                {
                    Stream dataStream = response.GetResponseStream();
                    StreamReader sr = new StreamReader(dataStream);
                    result = sr.ReadToEnd();
                }
            }
            catch (Exception ex) {
                WriteLogFile($"url={url}\nMessage={ex.Message}\nStackTrace={ex.StackTrace}");
                throw ex;
            }
            return result;
        }
    }
}