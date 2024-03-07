using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebShopping.Dtos;
using WebShopping.Models;

namespace WebShopping.Profiles
{
    public class ArticleContentListProfile : Profile
    {
        public ArticleContentListProfile()
        {
            CreateMap<article_content, article_content_Dto>()
            .ForMember(target => target.creation_date, option => option.MapFrom(source => source.creation_date.ToString("yyyy-MM-dd")))
            .ReverseMap();
        }
    }
}