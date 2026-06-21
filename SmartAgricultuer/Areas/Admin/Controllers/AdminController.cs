using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartAgricultuer.Models;
using SmartAgricultuer.ViewModels;
using Microsoft.EntityFrameworkCore;
using SmartAgricultuer.ViewModels;

namespace SmartAgricultuer.Areas.Admin.Controllers
{
    // تحديد أن الكنترولر تابع لمنطقة الأدمن
    [Area("Admin")]
    public class AdminPanelController : Controller
    {
        private readonly AppdbContext _context;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public AdminPanelController(AppdbContext context, SignInManager<ApplicationUser> signInManager)
        {
            _context = context;
            _signInManager = signInManager;
        }
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
        public IActionResult Plants()
        {
            return View();
        }

        public async Task<IActionResult> Home_Analses()
        {
            var totalUsers = await _context.Users.CountAsync(); // أو _userManager.Users.CountAsync()
            var uploads = await _context.Uploads.Where(u => u.IsDeleted != true).ToListAsync();
            var results = await _context.AnalysisResults.ToListAsync();

            int diseasedPlants = results.Count(r => r.DetectedPlantId != null && r.IsDiseased == true);
            int healthyPlants = results.Count(r => r.DetectedPlantId != null && r.IsDiseased == false);
            int insectDetections = results.Count(r => r.DetectedInsectId != null);
            int totalAnalyzedForChart = diseasedPlants + healthyPlants + insectDetections;

            var viewModel = new AdminDashboardViewModel
            {
                TotalUsers = totalUsers,
                TotalUploads = uploads.Count,
                TotalAnalyses = results.Count,
                DiseasedPlants = diseasedPlants,
                HealthyPlants = healthyPlants,
                InsectDetections = insectDetections,

                AvgConfidence = results.Any()
                    ? (double)results.Average(r => r.ConfidenceScore ?? 0)
                    : 0,

                HealthyPct = totalAnalyzedForChart > 0
                    ? Math.Round((double)healthyPlants / totalAnalyzedForChart * 100, 1) : 0,
                DiseasedPct = totalAnalyzedForChart > 0
                    ? Math.Round((double)diseasedPlants / totalAnalyzedForChart * 100, 1) : 0,
                InsectPct = totalAnalyzedForChart > 0
                    ? Math.Round((double)insectDetections / totalAnalyzedForChart * 100, 1) : 0,
            };

            // أكثر الأمراض اكتشافاً
            var diseaseGroups = await _context.AnalysisResults
                .Where(r => r.DetectedDiseaseId != null)
                .Include(r => r.DetectedDisease)
                .GroupBy(r => r.DetectedDisease!.Name)
                .Select(g => new { Name = g.Key, Count = g.Count() })
                .OrderByDescending(g => g.Count)
                .Take(4)
                .ToListAsync();

            int maxDiseaseCount = diseaseGroups.Any() ? diseaseGroups.Max(d => d.Count) : 1;
            viewModel.TopDiseases = diseaseGroups.Select(d => new DiseaseStatItem
            {
                Name = d.Name ?? "Unknown",
                Count = d.Count,
                Percentage = Math.Round((double)d.Count / maxDiseaseCount * 100, 1)
            }).ToList();

            // أكثر الحشرات شيوعاً
            var insectGroups = await _context.AnalysisResults
                .Where(r => r.DetectedInsectId != null)
                .Include(r => r.DetectedInsect)
                .GroupBy(r => new { r.DetectedInsect!.Name, r.DetectedInsect.Status })
                .Select(g => new { g.Key.Name, g.Key.Status, Count = g.Count() })
                .OrderByDescending(g => g.Count)
                .Take(3)
                .ToListAsync();

            viewModel.TopInsects = insectGroups.Select(i => new InsectStatItem
            {
                Name = i.Name ?? "Unknown",
                Count = i.Count,
                Status = i.Status
            }).ToList();

            // أكثر النباتات تحليلاً
            var plantGroups = await _context.AnalysisResults
                .Where(r => r.DetectedPlantId != null)
                .Include(r => r.DetectedPlant)
                .GroupBy(r => r.DetectedPlant!.Name)
                .Select(g => new { Name = g.Key, Count = g.Count() })
                .OrderByDescending(g => g.Count)
                .Take(4)
                .ToListAsync();

            int totalPlantAnalyses = plantGroups.Sum(p => p.Count);
            viewModel.TopPlants = plantGroups.Select(p => new PlantStatItem
            {
                Name = p.Name ?? "Unknown",
                Count = p.Count,
                Percentage = totalPlantAnalyses > 0
                    ? Math.Round((double)p.Count / totalPlantAnalyses * 100, 1) : 0
            }).ToList();

            // النشاط اليومي آخر 7 أيام
            var last7Days = Enumerable.Range(0, 7)
                .Select(i => DateTime.UtcNow.Date.AddDays(-6 + i))
                .ToList();

            viewModel.WeeklyActivity = last7Days.Select(day => new DailyActivityItem
            {
                DayLabel = day.ToString("ddd").ToUpper(),
                Uploads = uploads.Count(u => u.CreatedAt.HasValue && u.CreatedAt.Value.Date == day),
                Users = uploads.Where(u => u.CreatedAt.HasValue && u.CreatedAt.Value.Date == day)
                                .Select(u => u.UserId)
                                .Distinct()
                                .Count()
            }).ToList();

            // آخر العمليات
            var recent = await _context.Uploads
                .Where(u => u.IsDeleted != true)
                .Include(u => u.User)
                .Include(u => u.AnalysisResults)
                    .ThenInclude(r => r.DetectedPlant)
                .Include(u => u.AnalysisResults)
                    .ThenInclude(r => r.DetectedDisease)
                .Include(u => u.AnalysisResults)
                    .ThenInclude(r => r.DetectedInsect)
                .OrderByDescending(u => u.CreatedAt)
                .Take(8)
                .ToListAsync();

            viewModel.RecentActivity = recent.Select(u =>
            {
                var result = u.AnalysisResults.FirstOrDefault();
                return new RecentActivityItem
                {
                    UserName = u.User?.Name ?? "Unknown",
                    PlantName = result?.DetectedPlant?.Name,
                    ScientificName = result?.DetectedPlant?.ScientificName,
                    ResultLabel = result?.DetectedInsect?.Name
                        ?? result?.DetectedDisease?.Name
                        ?? "Healthy",
                    IsHealthy = result?.IsDiseased == false,
                    Confidence = result?.ConfidenceScore,
                    Date = u.CreatedAt
                };
            }).ToList();

            return View(viewModel);
        }
            [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction("Login", "Account", new { area = "" });
        }
    }
}