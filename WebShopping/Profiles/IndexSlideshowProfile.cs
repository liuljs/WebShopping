using WebShopping.Dtos;
using WebShopping.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;

namespace WebShopping.Profiles
{
    public class IndexSlideshowProfile : Profile
    {
        public IndexSlideshowProfile()
        {
            CreateMap<IndexSlideshow, IndexSlideshowGetDto>()
                .ForMember(o => o.Creation_Date, y => y.MapFrom(s => WebShopping.Helpers.Tools.Formatter.FormatDate(s.Creation_Date)))
                .ReverseMap();
        }          
    }
}