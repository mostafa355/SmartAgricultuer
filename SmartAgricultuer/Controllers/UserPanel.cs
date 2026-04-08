using Microsoft.AspNetCore.Mvc;

namespace SmartAgricultuer.Controllers
{
    public class UserPanel : Controller
    {
        public IActionResult Home()
        {
            return View();
        }

        public IActionResult u()
        {
            return View();
        }
    }
}
