using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using WebShopping.Models;
using WebShopping.Dtos;

namespace WebShopping.Profiles
{
    public class KnowledgeContentListProfile : Profile
    {
        public KnowledgeContentListProfile()
        {
            CreateMap<Knowledge_content, Knowledge_content_Dto>()
                .ForMember(target => target.creation_date, option => option.MapFrom(source => source.creation_date.ToString("yyyy-MM-dd")))
                .ReverseMap();
        }
    }
}