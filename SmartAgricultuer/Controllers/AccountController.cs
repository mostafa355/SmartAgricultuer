using Microsoft.AspNetCore.Mvc;
using SmartAgricultuer.Services;
using SmartAgricultuer.ViewModels;

namespace SmartAgricultuer.Controllers
{
    public class AccountController : Controller
    {
        private readonly IAuthService _authService;

        public AccountController(IAuthService authService)
        {
            _authService = authService;
        }


        public IActionResult Login() => View();

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (!ModelState.IsValid) return View(model);

            // بنسأل الـ Service: الدخول نجح؟ وإيه الـ Role؟
            var role = await _authService.LoginAsync(model);

            if (role == "Admin")
                return RedirectToAction("Index", "Home", new { area = "Admin" });

            if (role == "User")
                return RedirectToAction("Index", "Home");

            // لو role == null يبقى الدخول فشل
            ModelState.AddModelError("", "الإيميل أو الباسورد غلط");
            return View(model);
        }

        // GET: /Account/Register
        // بيعرض صفحة التسجيل فارغة
        public IActionResult Register() => View();

        // POST: /Account/Register
        // بيستقبل البيانات من الصفحة ويبعتها للـ Service
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (!ModelState.IsValid) return View(model);

            // بنبعت البيانات للـ Service ويرجعلنا النتيجة
            var result = await _authService.RegisterAsync(model);

            if (result.Succeeded)
                return RedirectToAction("Index", "Home");

            // لو فيه أخطاء نضيفها للـ ModelState عشان تظهر في الصفحة
            foreach (var error in result.Errors)
                ModelState.AddModelError("", error.Description);

            return View(model);
        }

        // POST: /Account/Logout
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await _authService.LogoutAsync();
            return RedirectToAction("Login");
        }
    }
}