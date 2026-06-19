using Microsoft.AspNetCore.Identity;

namespace SmartAgricultuer.Models // اتأكد إن الـ Namespace نفس اللي في باقي الملفات
{
    // بنعرفه إن الـ ID نوعه int عشان يمشي مع داتابيز بتاعتك
    public class ApplicationUser : IdentityUser<int>
    {
        public string Name { get; set; } = string.Empty;
        public bool IsDeleted { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string? ProfilePicture { get; set; }
    }
}