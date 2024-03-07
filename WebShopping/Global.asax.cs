using WebShopping;
using WebShopping.Auth;
using Newtonsoft.Json;
using System;
using System.Security.Principal;
using System.Web;
using System.Web.Http;
using System.Web.Security;

namespace WebShoppingAdmin
{
    public class WebApiApplication : HttpApplication
    {
        protected void Application_Start()
        {
            UnityWebApiActivator.Start();          
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            ;
        }

        /// <summary>
        /// Authen right for user
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        ////給登陸用戶賦許可權
        protected void Application_AuthenticateRequest(Object sender, EventArgs e)
        {
            if (HttpContext.Current.User != null)
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (HttpContext.Current.User.Identity is FormsIdentity)
                    {
                        //Get current user identitied by forms
                        FormsIdentity id = (FormsIdentity)HttpContext.Current.User.Identity;
                        // get FormsAuthenticationTicket object
                        FormsAuthenticationTicket ticket = id.Ticket;
                        string userData = ticket.UserData;
                        var _identityData = JsonConvert.DeserializeObject<IdentityData>(userData); //解析登入時儲存的UserData
                        string[] roles = _identityData.Identity.Split(',');
                        // set the new identity for current user.
                        HttpContext.Current.User = new GenericPrincipal(id, roles);
                    }
                }
            }
        }
    }   
}



