using AutoMapper;
using WebShopping.Dtos;
using WebShopping.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebShopping.Profiles
{
    public class NewsProfile : Profile
    {
        public NewsProfile()
        {
            CreateMap<News, NewsGetDto>()
                .ForMember(o => o.Date, y => y.MapFrom(s => s.Created_Date.ToString("yyyy-MM-dd")))
                .ReverseMap();
        }
    }
}