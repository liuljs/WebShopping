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
    public interface IFAQService
    {            
        FAQ GetFAQData(int id);

        List<FAQ> GetFAQSetData();

        FAQ InsertFAQ(HttpRequest request);

        void UpdateFAQ(HttpRequest request, FAQ faq);

        void DeleteFAQ(FAQ faq);
    }
}
