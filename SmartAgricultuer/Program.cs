using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SmartAgricultuer.Models;
using SmartAgricultuer.Services; 
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

            // بنقول للـ DI Container لو حد طلب IAuthService يديله AuthService
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IImageService, ImageService>();
            // محتاج HttpClient عشان يتكلم مع الـ Python API
            builder.Services.AddHttpClient<IDiagnosisService, DiagnosisService>();

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
            // ← أضف هنا
            builder.Services.ConfigureApplicationCookie(options =>
            {
                options.LoginPath = "/Account/Login";
                options.AccessDeniedPath = "/Account/Login";
                options.ExpireTimeSpan = TimeSpan.FromDays(30); // الكوكي تفضل شغالة 30 يوم
                options.SlidingExpiration = true; // كل ما يدخل بتتجدد الـ 30 يوم
                options.Cookie.HttpOnly = true; // أمان
                options.Cookie.IsEssential = true;
            });
            builder.Services.AddScoped<IHistoryService, HistoryService>(); // ← لو مش موجود


            builder.Services.AddDistributedMemoryCache();
            builder.Services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(30);
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });

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
            app.UseSession();
            app.UseAuthentication();
            app.UseAuthorization();

            // 3. ترتيب الـ Routes (الـ Area لازم تكون فوق الـ Default)
            app.MapControllerRoute(
                name: "areas",
                pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            using (var scope = app.Services.CreateScope())
            {
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

                // إنشاء الـ Roles
                string[] roleNames = { "Admin", "User" };
                foreach (var roleName in roleNames)
                {
                    if (!await roleManager.RoleExistsAsync(roleName))
                        await roleManager.CreateAsync(new IdentityRole<int>(roleName));
                }

                // إنشاء أول Admin
                string adminEmail = "admin@plantguard.com";
                string adminPassword = "Admin@123";

                if (await userManager.FindByEmailAsync(adminEmail) == null)
                {
                    var admin = new ApplicationUser
                    {
                        UserName = adminEmail,
                        Email = adminEmail,
                        EmailConfirmed = true,
                        Name = "Admin"
                    };

                    var result = await userManager.CreateAsync(admin, adminPassword);
                    if (result.Succeeded)
                        await userManager.AddToRoleAsync(admin, "Admin");
                }
            }

            app.Run();
        }
    }
}