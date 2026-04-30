using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic; // لازم عشان الـ List
using System.Linq; // لازم عشان الـ Enumerable

namespace SmartAgricultuer.Controllers
{
    public class BaseController : Controller
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            // الأفضل نستخدم كلاس بسيط بدل الـ Anonymous Type عشان الـ View يشوفه بسهولة
            var dummyScans = Enumerable.Range(1, 10).Select(i => new TempScan
            {
                Id = i,
                Date = DateTime.Now.AddDays(-i)
            }).ToList();

            ViewBag.UserScans = dummyScans;

            base.OnActionExecuting(context);
        }
    }

    // كلاس مؤقت للتجربة فقط
    public class TempScan
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
    }
}