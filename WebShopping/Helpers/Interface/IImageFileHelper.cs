using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace WebShopping.Helpers
{
    public interface IImageFileHelper
    {
        string GetImageFolderPath(string rootFolder, string imageFolder);

        string SaveUploadImageFile(HttpPostedFile postedFile,string fileName,string saveFolder);

        string GetImageLink(string folder, string fileName);
    }
}
