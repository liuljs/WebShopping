using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebShopping.Dtos;
using WebShopping.Models;

namespace WebShopping.Profiles
{
    public class ArticleCategoryListProfile : Profile
    {
        public ArticleCategoryListProfile()
        {
            CreateMap<article_category, article_category_Dto>().ReverseMap();
        }
    }
}