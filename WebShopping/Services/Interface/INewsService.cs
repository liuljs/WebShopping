using WebShopping.Helpers;
using WebShopping.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace WebShopping.Services
{
    public interface INewsService
    {            
        News GetNewsData(Guid id);

        List<News> GetNewsSetData(int? count, int? page);

        News InsertNewData(HttpRequest request);

        string UploadImage(HttpRequest request);

        void UpdateNewData(HttpRequest request, News news);

        string UpdateUploadImage(HttpRequest request, Guid newsId);

        void UpdateTopOption(News news);

        void DeleteNewData(News news);
    }
}
