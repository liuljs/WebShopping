using AutoMapper;
using WebShopping.Dtos;
using WebShopping.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebShopping.Profiles
{
    public class FAQProfile : Profile
    {
        public FAQProfile()
        {
            CreateMap<FAQ, FAQGetDto>()
                .ReverseMap();
        }
    }
}