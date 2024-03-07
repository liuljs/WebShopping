﻿using System;
using System.Configuration;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using System.Web;

namespace WebShopping.Helpers
{
    public class Tools
    {
        private static Tools m_Instance;
        private static readonly object m_syncRoot = new object();

        public static string WebSiteUrl { get { return ConfigurationManager.AppSettings["WebSiteUrl"]; } }
        public string WebSiteImgUrl { get { return ConfigurationManager.AppSettings["WebSiteImgUrl"]; } }
        public string Abouts { get { return ConfigurationManager.AppSettings["Abouts"]; } }
        public string Lighting { get { return ConfigurationManager.AppSettings["Lighting"]; } }
        public string Knowledge { get { return ConfigurationManager.AppSettings["Knowledge"]; } }
        public string PaymentMailing { get { return ConfigurationManager.AppSettings["PaymentMailing"]; } }
        public string PictureList { get { return ConfigurationManager.AppSettings["PictureList"]; } }
        public string OtherAccessories { get { return ConfigurationManager.AppSettings["OtherAccessories"]; } }
        public string Other1 { get { return ConfigurationManager.AppSettings["Other1"]; } }
        public string DefaultValueSort { get { return ConfigurationManager.AppSettings["DefaultValueSort"]; } }
        public string Products { get { return ConfigurationManager.AppSettings["Products"]; } }
        public string Privacies { get { return ConfigurationManager.AppSettings["Privacies"]; } }
        public string Terms { get { return ConfigurationManager.AppSettings["Terms"]; } }
        public string Capthcas { get { return ConfigurationManager.AppSettings["Capthcas"]; } }
        public string Banners { get { return ConfigurationManager.AppSettings["Banners"]; } }
        public string Mail_Port { get { return ConfigurationManager.AppSettings["Mail_Port"]; } }        
        public string Mail_Host { get { return ConfigurationManager.AppSettings["Mail_Host"]; } }
        public string Smtp_Id { get { return ConfigurationManager.AppSettings["Smtp_Id"]; } }
        public string Smtp_Pw { get { return ConfigurationManager.AppSettings["Smtp_Pw"]; } }
        public static string Admin_Mail { get { return ConfigurationManager.AppSettings["Admin_Mail"]; } }
        public static string Company_Name { get { return ConfigurationManager.AppSettings["Company_Name"]; } }
        public static string MerchantId { get { return ConfigurationManager.AppSettings["MerchantId"]; } }
        public static string TerminalId { get { return ConfigurationManager.AppSettings["TerminalId"]; } }
        public static string Host { get { return ConfigurationManager.AppSettings["Host"]; } }

        //oAuth-Line
        public static string oAuthLineClientId { get { return ConfigurationManager.AppSettings["oAuthLineClientId"]; } }
        public static string oAuthLineClientSecret { get { return ConfigurationManager.AppSettings["oAuthLineClientSecret"]; } }

        //oAuth-Google
        public static string oAuthGoogleClientId { get { return ConfigurationManager.AppSettings["oAuthGoogleClientId"]; } }
        public static string oAuthGoogleClientSecret { get { return ConfigurationManager.AppSettings["oAuthGoogleClientSecret"]; } }

        public Tools()
        {
        }

        public static Tools GetInstance()
        {
            if (m_Instance == null)
            {
                lock (m_syncRoot)
                {
                    if (m_Instance == null)
                    {
                        m_Instance = new Tools();
                    }
                }
            }                   

            return m_Instance;
        }

        /// <summary>
        /// 數字或英文字轉成圖型並儲存
        /// </summary>
        /// <param name="p_strWord"> 英文或數字字串 </param>
        /// <param name="p_iWidth"> 圖寛 </param>
        /// <param name="p_iHeight"> 圖高 </param>
        /// <param name="p_iFontSize"> 字型大小 </param>
        /// <param name="p_strPath"> 驗證碼圖型位置 </param>
        /// <returns> 是否轉圖成功 </returns>
        public bool TransWordToImage(string p_strWord, int p_iWidth, int p_iHeight, int p_iFontSize, string p_strPath)
        {
            try
            {
                int iFontWidth_ = p_iFontSize + 1;   //字型寛度
                int iFontHeight_ = p_iFontSize + 10; //字型高度

                int iX_ = (p_iWidth - (p_strWord.Length * iFontWidth_)) / 2;    //開始畫圖的起始X位置
                int iY_ = (p_iHeight - iFontHeight_) / 2;                       //開始畫圖的起始Y位置


                Bitmap Bmp = new Bitmap(p_iWidth, p_iHeight);  //建立實體圖檔並設定大小
                Graphics Gpi = Graphics.FromImage(Bmp);
                MemoryStream stream = new MemoryStream();

                Gpi.Clear(Color.FromArgb(255, 57, 63, 63));    //設定背景顏色
                Font _font = new Font("Consolas", p_iFontSize, FontStyle.Bold); //設定字型大小.樣式
                for (int i = 0; i < p_strWord.Length; i++)
                {
                    Int32 j = iX_ + i * p_iFontSize;
                    Gpi.DrawString(p_strWord[i].ToString(), _font, new SolidBrush(Color.FromArgb(255, 140, 145, 144)), j, iY_);
                }
                Bmp.Save(stream, ImageFormat.Jpeg);

                byte[] byteArray = stream.GetBuffer(); //將Bitmap轉為Byte[]                

                // Create random data to write to the file.                   

                using (FileStream
                    fileStream = new FileStream(p_strPath, FileMode.Create))
                {
                    // Write the data to the file, byte by byte.
                    for (int i = 0; i < byteArray.Length; i++)
                    {
                        fileStream.WriteByte(byteArray[i]);
                    }

                    // Set the stream position to the beginning of the file.
                    fileStream.Seek(0, SeekOrigin.Begin);

                    // Read and verify the data.
                    for (int i = 0; i < fileStream.Length; i++)
                    {
                        if (byteArray[i] != fileStream.ReadByte())
                        {
                            Console.WriteLine("Error writing data.");
                        }
                    }
                    Console.WriteLine("The data was written to {0} " +
                        "and verified.", fileStream.Name);
                }
                return true;
            }
            catch(Exception ex)
            {
                Console.WriteLine($"Ex {ex.Message}");
                return false;
            }            
        }

        /// <summary>
        /// 圖片存放路徑
        /// </summary>
        /// <param name="p_strFolder"> 依此資料夾存放分類的圖片 </param>        
        /// <returns> 路徑 </returns>
        public string GetImagePathName(string p_strFolder)
        {
            string strSavePath_ = HttpContext.Current.Server.MapPath("/");
            strSavePath_ = Path.GetDirectoryName(Path.GetDirectoryName(strSavePath_)) + @"\Admin\backStage\img\" + p_strFolder + @"\";

            if (!Directory.Exists(strSavePath_))
                Directory.CreateDirectory(strSavePath_);

            return strSavePath_ ;
        }

        /// <summary> 產生亂數字串 </summary>
        /// <param name="p_iNumber">產生幾個數值</param>
        /// <returns> 亂數字串 </returns>
        public string CreateRandomCode(int p_iNumber)
        {
            string strAllChar_ = "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
            string[] allCharArray_ = strAllChar_.Split(',');
            string strRandomCode_ = "";
            int iTemp_ = -1;

            Random rand = new Random();
            for (int i = 0; i < p_iNumber; i++)
            {
                if (iTemp_ != -1)
                {
                    rand = new Random(i * iTemp_ * ((int)DateTime.Now.Ticks));
                }
                int t = rand.Next(36);
                if (iTemp_ != -1 && iTemp_ == t)
                {
                    return CreateRandomCode(p_iNumber);
                }
                iTemp_ = t;
                strRandomCode_ += allCharArray_[t];
            }

            Console.WriteLine($"Capthcas = {strRandomCode_}");

            return strRandomCode_;
        }

        /// <summary>
        /// 產生雜湊碼
        /// </summary>        
        /// <returns></returns>
        public string CreateSaltCode()
        {
            RNGCryptoServiceProvider rngp_ = new RNGCryptoServiceProvider();
            byte[] rb = new byte[15];
            rngp_.GetBytes(rb);
            return Convert.ToBase64String(rb);            
        }

        /// <summary>
        /// 刪除驗證碼圖片
        /// </summary>
        /// <param name="p_strPath">路徑</param>
        /// <param name="p_iBeforeHours">幾小時之前的</param>
        public void DeleteCapthcas(string p_strPath, int p_iBeforeHours)
        {
            /*
            string strFileName_ = $"{DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss_fff")}.png";
            string strPathName_ = Tools.GetInstance().GetImagePathName(Tools.GetInstance().Capthcas);       //圖片存放路徑
            string strCapthcas_ = Tools.GetInstance().CreateRandomCode(6);                                  //產生亂數字串
            Tools.GetInstance().TransWordToImage(strCapthcas_, 180, 50, 20, $"{strPathName_}{strFileName_}");//數字或英文字轉成圖型並儲存
            Tools.GetInstance().DeleteCapthcas(strPathName_, 1);                                            //刪除驗證碼圖片
            string strImageLink_ = Tools.GetInstance().GetImageLink(Tools.GetInstance().Capthcas, strFileName_);//取得圖片連結字串
            */

            string[] picList_ = Directory.GetFiles(p_strPath, "*.png");  //EX:2021-04-28_10-33-28-59_062.png

            foreach (var v in picList_)
            {
                string[] pathSplit_ = v.Split(new char[] { '\\' }, StringSplitOptions.RemoveEmptyEntries);
                if(pathSplit_.Length <= 0)
                {
                    Console.WriteLine($"路徑有問題 ={v}, F = {System.Reflection.MethodBase.GetCurrentMethod().Name}");
                }
                else
                {
                    string strName_ = pathSplit_[pathSplit_.Length - 1];
                    //副檔名.png
                    if (strName_.Contains(".png"))
                    {
                        string[] dateSplit_ = strName_.Split(new char[] { '_' });
        
                        if(dateSplit_.Length == 3)
                        {
                            DateTime dt_;
                            
                            if (DateTime.TryParse($"{dateSplit_[0]} {dateSplit_[1].Replace("-", ":")}" , out dt_))
                            {
                                if(DateTime.Compare(dt_, DateTime.Now.AddHours(p_iBeforeHours*-1)) == -1)
                                {
                                    File.Delete(v);
                                }
                            }                            
                        }
                        else
                        {
                            Console.WriteLine($"檔名有問題 ={v}, F = {System.Reflection.MethodBase.GetCurrentMethod().Name}");
                        }
                    }
                }                
            }
        }

        /// <summary>
        ///  取得圖片連結字串
        /// </summary>
        /// <param name="p_strFolder"> 依此資料夾存放分類的圖片 </param>        
        /// <param name="p_strName"> 檔名 </param>        
        /// <returns> 圖片連結字串 </returns>
        public string GetImageLink(string p_strFolder, string p_strName)
        {
            return Tools.GetInstance().WebSiteImgUrl + @"/" + p_strFolder + @"/" + p_strName; //回傳圖片的URL && 檔名
        }

        public class Formatter
        {
            /// <summary>
            /// 是否是數字
            /// </summary>
            /// <param name="anyString"></param>
            /// <returns></returns>
            public static bool IsNumeric(string anyString)
            {
                if (anyString == null)
                {
                    anyString = "";
                }
                if (anyString.Length > 0)
                {
                    double dummyOut = new double();
                    System.Globalization.CultureInfo cultureInfo =
                        new System.Globalization.CultureInfo("en-US", true);

                    return Double.TryParse(anyString, System.Globalization.NumberStyles.Any,
                        cultureInfo.NumberFormat, out dummyOut);
                }
                else
                {
                    return false;
                }
            }

            /// <summary>
            /// 字串轉日期
            /// </summary>
            /// <param name="s"></param>
            /// <returns></returns>
            public static DateTime DateTimeParseExact(string s)
            {
                try
                {

                    if (Regex.IsMatch(s, "^[0-9]{4}/[0-9]{2}/[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$"))//訊航
                        return DateTime.ParseExact(s, "yyyy/MM/dd HH:mm:ss", null);
                    else if (Regex.IsMatch(s, "^[0-9]{8}[0-9]{6}$"))//財金
                        return DateTime.ParseExact(s, "yyyyMMddHHmmss", null);
                    else if (Regex.IsMatch(s, "^[0-9]{8} [0-9]{6}$"))//聯信,智付通
                        return DateTime.ParseExact(s, "yyyyMMdd HHmmss", null);
                    else
                        return DateTime.Parse(s);
                }
                catch (Exception ex)
                {
                    SystemFunctions.WriteLogFile(ex.Message + "\n" + ex.StackTrace);
                }
                return DateTime.Now;
            }

            /// <summary>
            /// 轉前台呈現的日期格式
            /// </summary>
            /// <param name="date"></param>
            /// <returns></returns>
            public static string FormatDate(DateTime? date) {
                DateTime d = date ?? DateTime.MinValue;
                if (DateTime.MinValue == d) return "";
                return d.ToString("yyyy/MM/dd HH:mm");
            }
            /// <summary>
            /// 轉前台呈現的日期格式
            /// </summary>
            /// <param name="date"></param>
            /// <returns></returns>
            public static string FormatDate(string date)
            {
                if (IsDate(date))
                {
                    DateTime dateTime = DateTimeParseExact(date);
                    return FormatDate(dateTime);
                }
                return date;
            }

            /// <summary>
            /// 是否是日期
            /// </summary>
            /// <param name="anyString"></param>
            /// <returns></returns>
            public static bool IsDate(string anyString)
            {
                if (anyString == null)
                {
                    anyString = "";
                }
                if (anyString.Length > 0)
                {
                    DateTime? dummyDate = null;
                    try
                    {
                        dummyDate = DateTime.Parse(anyString);
                    }
                    catch
                    {
                        return false;
                    }
                    return true;
                }
                else
                {
                    return false;
                }
            }
            /// <summary>
            /// 是否為有效Email
            /// </summary>
            /// <param name="email"></param>
            /// <returns></returns>
            public static bool IsValidEmail(string email)
            {
                try
                {
                    var addr = new System.Net.Mail.MailAddress(email);
                    return addr.Address == email;
                }
                catch
                {
                    return false;
                }
            }
        }
    }
}