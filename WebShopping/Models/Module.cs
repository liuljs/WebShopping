using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Data;
using ecSqlDBManager;
using System.Data.SqlClient;
using System.Web.Http;

namespace WebShoppingAdmin.Models
{
    public class Module : BaseModel
    {
        public Guid Id { get; set; }

        [Required]
        [StringLength(2)]
        public string Code { get; set; }

        [Required]      
        public string Name { get; set; }

        [Required]
        [StringLength(1)]
        [RegularExpression(@"[Y]|[N]")]
        public string act_view { get; set; }

        public string act_add { get; set; }

        [Required]
        [StringLength(1)]
        [RegularExpression(@"[Y]|[N]")]
        public string act_edt { get; set; }

        [Required]
        [StringLength(1)]
        [RegularExpression(@"[Y]|[N]")]
        public string act_del { get; set; }

        public DataTable Get()
        {
            SqlCommand sql = new SqlCommand(@"
            SELECT
                [ID], [CODE], [NAME], [ACT_ADD], [ACT_DEL], [ACT_EDT]
            FROM [MODULE]");

            DataTable result = db.GetResult(sql);

            return result;
        }
    }   
}