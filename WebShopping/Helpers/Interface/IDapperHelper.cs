using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebShopping.Helpers
{
    public interface IDapperHelper
    {
        T QuerySqlFirstOrDefault<T>(string sql);

        T QuerySqlFirstOrDefault<T>(string sql, T paramData);

        TReturn QuerySqlFirstOrDefault<T1, TReturn>(string sql, T1 paramData);
   
        IEnumerable<T> QuerySetSql<T>(string sql);

        IEnumerable<T> QuerySetSql<T>(string sql, T paramData);
       
        IEnumerable<TReturn> QuerySetSql<T1, TReturn>(string sql, T1 paramData);

        int ExecuteSql(string sql);

        int ExecuteSql<T>(string sql, T paramData);

        int ExecuteSql<T>(string sql, IEnumerable<T> paramData);
        int QuerySingle<T>(string sql, T paramData);
    }
}
