using WebShopping.Auth;
using WebShoppingAdmin.Models;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace WebShoppingAdmin.Controllers
{
    /// <summary>
    /// 管理者群組
    /// </summary>
    [CustomAuthorize(Role.Admin)]
    [RoutePrefix("ManagerGroup")]
    public class ManagerGroupController : ApiController
    {
        [HttpPost]
        [Route("Get")]
        public object Get([FromBody] ManagerGroupGetParam param)
        {
            try
            {
                using (ManagerGroup obj = new ManagerGroup())
                {
                    Guid? id = param?.id;

                    return new ApiResult(obj.Get(id));
                }
            }
            catch (Exception ex)
            {
                return new ErrApiResult(ex.Message);
            }
        }

        [HttpPost]
        [Route("Insert")]
        public object Insert(ManagerGroupInsertParam param)
        {
            param.id = Guid.NewGuid(); //新增的群組ID

            // 無視 id 的驗證錯誤
            if (ModelState.IsValid)
            {
                try
                {
                    using (ManagerGroup obj = new ManagerGroup())
                    {
                        obj.Insert(param);
                        return new ApiResult(obj.Get(param.id));
                    }
                }
                catch (Exception ex)
                {
                    return new ErrApiResult(ex.Message);
                }
            }
            else
                return new ErrApiResult(ModelState.Values.FirstOrDefault()?.Errors.FirstOrDefault()?.ErrorMessage);
        }

        [HttpPost]
        [Route("Update")]
        public object Update(ManagerGroupUpdateParam param)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    using (ManagerGroup obj = new ManagerGroup())
                    {
                        obj.Update(param);
                        return new ApiResult(obj.Get(param.id));
                    }
                }
                catch (Exception ex)
                {
                    return new ErrApiResult(ex.Message);
                }
            }
            else
                return new ErrApiResult(ModelState.Values.FirstOrDefault()?.Errors.FirstOrDefault()?.ErrorMessage);
        }

        [HttpPost]
        [Route("Delete")]
        public object Delete(ManagerGroupDeleteParam param)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    using (ManagerGroup obj = new ManagerGroup())
                    {
                        obj.Delete(param);
                        return new ApiResult();
                    }
                }
                catch (Exception ex)
                {
                    return new ErrApiResult(ex.Message);
                }
            }
            else
                return new ErrApiResult(ModelState.Values.FirstOrDefault()?.Errors.FirstOrDefault()?.ErrorMessage);
        }

        [HttpPost]
        [Route("UpdateLnk")]
        public object UpdateLnk(ManagerGroupLnkParam param)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    using (ManagerGroup obj = new ManagerGroup())
                    {
                        obj.UpdateLnk(param);
                        return new ApiResult();
                    }
                }
                catch (Exception ex)
                {
                    return new ErrApiResult(ex.Message);
                }
            }
            else
                return new ErrApiResult(ModelState.Values.FirstOrDefault()?.Errors.FirstOrDefault()?.ErrorMessage);
        }
    }
}
