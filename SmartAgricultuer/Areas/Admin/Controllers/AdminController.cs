using Microsoft.AspNetCore.Mvc;

namespace SmartAgricultuer.Areas.Admin.Controllers
{
    // تحديد أن الكنترولر تابع لمنطقة الأدمن
    [Area("Admin")]
    public class AdminPanelController : Controller
    {
        // الأكشن الخاص بصفحة الحشرات (Insects)
        public IActionResult Insects()
        {
            return View();
        }
        public IActionResult Add_Insects()
        {
            return View();
        }
        public IActionResult table_plant()
        {
            return View(); 
        }
        public IActionResult Add_plant()
        {
            return View(); 
        }
        public IActionResult adddisease()
        {
            return View(); 
        }
        public IActionResult Diseases()
        {
            return View();
        }
        public IActionResult profile()
        {
            return View();
        }
       

        // لو حابة مستقبلاً تضيفي صفحة رئيسية لوحة التحكم (Dashboard)
        public IActionResult Index()
        {
            return View();
        }
    }
}