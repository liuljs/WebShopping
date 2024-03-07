using WebShopping.Dtos;
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
    public interface IIndexSlideshowService
    {
        IndexSlideshow GetIndexSlideshowImage(Guid id);

        List<IndexSlideshow> GetIndexSlideshowImages();

        IndexSlideshow AddIndexSlideshowImage(HttpRequest request);

        void UpdateIndexSlideshowImage(IndexSlideshow  indexSlideshow);

        void DeleteIndexSlideshowImage(IndexSlideshow indexSlideshow);      
    }
}
