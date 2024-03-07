using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using WebShopping.Models;
using WebShopping.Dtos;

namespace WebShopping.Profiles
{
    public class LightingContentListProfile : Profile
    {
        public LightingContentListProfile()
        {
            CreateMap<Lighting_content, Lighting_content_Dto>()
                .ForMember(target => target.creation_date, option => option.MapFrom(source => source.creation_date.ToString("yyyy-MM-dd")))
                .ReverseMap();
        }
    }
}