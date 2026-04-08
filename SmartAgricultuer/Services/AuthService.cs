using Microsoft.AspNetCore.Identity;
using SmartAgricultuer.Models;
using SmartAgricultuer.ViewModels;

namespace SmartAgricultuer.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public AuthService(UserManager<ApplicationUser> userManager,
                           SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<string?> LoginAsync(LoginViewModel model)
        {
            // بنحاول نعمل Login بالإيميل والباسورد
            var result = await _signInManager.PasswordSignInAsync(
                model.Email, model.Password, model.RememberMe, false);

            // لو فشل نرجع null
            if (!result.Succeeded) return null;

            // لو نجح نجيب الـ User ونشوف الـ Role بتاعه
            var user = await _userManager.FindByEmailAsync(model.Email);
            var roles = await _userManager.GetRolesAsync(user!);

            // نرجع اسم الـ Role عشان الـ Controller يوجه المستخدم
            return roles.Contains("Admin") ? "Admin" : "User";
        }

        public async Task<IdentityResult> RegisterAsync(RegisterViewModel model)
        {
            // بننشئ User جديد من بيانات الـ ViewModel
            var user = new ApplicationUser
            {
                Name = model.Name,
                Email = model.Email,
                UserName = model.Email,
                EmailConfirmed = true
            };

            // بنحاول نحفظه في الداتابيز بالباسورد
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                // لو نجح نضيفه للـ Role "User" تلقائياً
                await _userManager.AddToRoleAsync(user, "User");

                // بنعمله Sign In مباشرة بعد التسجيل
                await _signInManager.SignInAsync(user, isPersistent: false);
            }

            return result;
        }

        public async Task LogoutAsync()
        {
            // بنمسح الـ Session بتاع المستخدم
            await _signInManager.SignOutAsync();
        }
    }
}