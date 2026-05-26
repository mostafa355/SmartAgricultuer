using Microsoft.AspNetCore.Identity;
using SmartAgricultuer.ViewModels;

namespace SmartAgricultuer.Services
{
    // العقد - بيحدد إيه العمليات المتاحة بدون تفاصيل
    public interface IAuthService
    {
        // بترجع اسم الـ Role لو الدخول نجح، أو null لو فشل
        Task<string?> LoginAsync(LoginViewModel model);

        // بترجع IdentityResult فيه نتيجة التسجيل (نجاح أو أخطاء)
        Task<IdentityResult> RegisterAsync(RegisterViewModel model);

        // بتعمل Logout للمستخدم الحالي
        Task LogoutAsync();
    }
}