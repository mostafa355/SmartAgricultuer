using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SmartAgricultuer.Models;
using Microsoft.Extensions.DependencyInjection;
// تأكد من الـ Namespace بتاع الـ Context بتاعك
// لو AppdbContext موجود في فولدر Data سيب السطر ده، لو في Models امسحه
using SmartAgricultuer.Data;

namespace SmartAgricultuer
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // 1. هنا بنستخدم الداتابيز الصح بس (DefaultConnection)
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddDbContext<AppdbContext>(options =>
                options.UseSqlServer(connectionString));

            // 2. إعدادات الهوية (Identity) مربوطة بالـ Context الصح
            builder.Services.AddIdentity<ApplicationUser, IdentityRole<int>>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
                options.SignIn.RequireConfirmedAccount = false;
            })
            .AddEntityFrameworkStores<AppdbContext>()
            .AddDefaultTokenProviders();

            builder.Services.AddControllersWithViews();

            var app = builder.Build();

            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            // 3. ترتيب الـ Routes (الـ Area لازم تكون فوق الـ Default)
            app.MapControllerRoute(
                name: "areas",
                pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            // كود إنشاء الأدوار تلقائياً
            using (var scope = app.Services.CreateScope())
            {
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
                string[] roleNames = { "Admin", "User" };
                foreach (var roleName in roleNames)
                {
                    if (!await roleManager.RoleExistsAsync(roleName))
                    {
                        await roleManager.CreateAsync(new IdentityRole<int>(roleName));
                    }
                }
            }

            app.Run();
        }
    }
}