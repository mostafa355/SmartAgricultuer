using Microsoft.AspNetCore.Mvc;

namespace SmartAgricultuer.Controllers
{
    public class UserPanel : Controller
    {
        public IActionResult Home()
        {
            return View();
        }

        public IActionResult Upload()
        {
            return View();
        }
        public IActionResult Result()
        {
            return View();
        }
        public IActionResult Archive()
        {
            return View();
        }
    }
}
