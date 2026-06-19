using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartAgricultuer.Models;
using SmartAgricultuer.Services;
using SmartAgriculture.ViewModels;
using System.Security.Claims;


namespace SmartAgricultuer.Controllers
{
    [Authorize(Roles = "User")]
    public class UserPanel : BaseController
    {
        private readonly IImageService _imageService;
        private readonly IDiagnosisService _diagnosisService;
        private readonly IHistoryService _historyService;
        private readonly AppdbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        // دمج كل الخدمات في Constructor واحد فقط
        public UserPanel(
            IImageService imageService,
            IDiagnosisService diagnosisService,
            IHistoryService historyService,
            AppdbContext context,
            UserManager<ApplicationUser> userManager) // أضفنا الـ userManager هنا
            : base(historyService)
        {
            _imageService = imageService;
            _diagnosisService = diagnosisService;
            _historyService = historyService;
            _context = context;
            _userManager = userManager; // قمنا بتهيئة المتغير هنا
        }

        public IActionResult Home() => View();

        public IActionResult Upload() => View();

        [HttpPost]
        public async Task<IActionResult> Result(IFormFile fileInput, bool isInsect)
        {
            if (fileInput == null) return RedirectToAction("Upload");

            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                int analysisTypeId = isInsect ? 2 : 1;
                string folder = isInsect ? "Insects" : "Plants";

                // 1. حفظ الصورة
                string? imagePath = await _imageService.SaveImageAsync(fileInput, folder);
                if (imagePath == null)
                {
                    TempData["Error"] = "There's a problem uploading the image.";
                    return RedirectToAction("Upload");
                }

                // 2. حفظ الـ Upload في الداتابيز
                int uploadId = await _historyService.SaveUploadAsync(userId, analysisTypeId, imagePath);

                if (isInsect)
                {
                    // 3a. تشخيص حشرة
                    var insectResult = await _diagnosisService.DiagnoseInsectAsync(fileInput);

                    Console.WriteLine("==========================================");
                    Console.WriteLine($"✅ Success: {insectResult.Success}");
                    Console.WriteLine($"🐛 Detected: {insectResult.Detected}");
                    Console.WriteLine($"📋 Type: {insectResult.Type}");
                    Console.WriteLine($"⚠️ IsHarmful: {insectResult.IsHarmful}");
                    Console.WriteLine($"📊 Confidence: {insectResult.ConfidencePct}");
                    Console.WriteLine("==========================================");

                    if (!insectResult.Success)
                    {
                        TempData["Error"] = insectResult.Error;
                        return RedirectToAction("Upload");
                    }

                    await _historyService.SaveInsectResultAsync(uploadId, insectResult);
                }
                else
                {
                    // 3b. تشخيص نبات
                    var plantResult = await _diagnosisService.DiagnosePlantAsync(fileInput);

                    Console.WriteLine("==========================================");
                    Console.WriteLine($"✅ Success: {plantResult.Success}");
                    Console.WriteLine($"🌿 Plant: {plantResult.Plant}");
                    Console.WriteLine($"🦠 Disease: {plantResult.Disease}");
                    Console.WriteLine($"📋 Status: {plantResult.Status}");
                    Console.WriteLine($"⚠️ IsHarmful: {plantResult.IsHarmful}");
                    Console.WriteLine($"📊 Confidence: {plantResult.ConfidencePct}");
                    Console.WriteLine("==========================================");

                    if (!plantResult.Success)
                    {
                        TempData["Error"] = plantResult.Error;
                        return RedirectToAction("Upload");
                    }

                    await _historyService.SavePlantResultAsync(uploadId, plantResult);
                }

                // 4. Redirect للـ Result
                return RedirectToAction("Result", new { id = uploadId });
            }
            catch (Exception ex)
            {
                TempData["Error"] = $"{ex.Message} | {ex.InnerException?.Message}";
                return RedirectToAction("Upload");
            }
        }

        [HttpGet]
        public async Task<IActionResult> Result(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var result = await _historyService.GetHistoryByIdAsync(id, userId);

            if (result == null) return RedirectToAction("Upload");

            bool isInsect = result.AnalysisType == "Insect";
            ViewBag.ActiveId = id;
            ViewBag.IsInsect = isInsect;

            if (isInsect)
            {
                // جيب بيانات الحشرة من الداتابيز
                var insect = await _context.Insects
                    .Include(i => i.TreatmentSteps)
                    .Include(i => i.InsectPlants)
                        .ThenInclude(ip => ip.Plant)
                    .FirstOrDefaultAsync(i => i.Name == result.InsectName);

                var viewModel = new InsectResultViewModel
                {
                    imgurl = result.ImageUrl,
                    Confidence = (float?)result.Confidence,
                    IsHarmful = result.IsHarmful,
                    InsectName = insect?.Name,
                    ScientificName = insect?.ScientificName,
                    Description = insect?.Description,
                    Status = insect?.Status,
                    Prevention = insect?.Prevention,
                    ImageUrl = insect?.ImageUrl,
                    AffectedPlants = insect?.InsectPlants?.ToList(),
                    TreatmentSteps = insect?.TreatmentSteps?
                        .OrderBy(t => t.StepNumber)
                        .ToList() ?? new List<TreatmentStep>()
                };

                return View("InsectResult", viewModel);
            }
            else
            {
                // جيب بيانات النبات والمرض من الداتابيز
                var disease = await _context.PlantDiseases
                    .Include(d => d.Plant)
                    .Include(d => d.TreatmentSteps)
                    .FirstOrDefaultAsync(d => d.Name == result.DiseaseName);

                var viewModel = new DiseaseResultViewModel
                {
                    imgurl = result.ImageUrl,
                    Confidence = (float?)result.Confidence,
                    IsHarmful = result.IsHarmful ,
                    DiseaseName = disease?.Name,
                    DiseaseDescription = disease?.Description,
                    Symptoms = disease?.Symptoms,
                    Causes = disease?.Causes,
                    Prevention = disease?.Prevention,
                    PlantType = disease?.PlantType,
                    DetectionStatus = disease?.DetectionStatus,
                    PlantName = disease?.Plant?.Name,
                    ScientificName = disease?.Plant?.ScientificName,
                    PlantDescription = disease?.Plant?.Description,
                    GeneralCare = disease?.Plant?.GeneralCare,
                    TreatmentSteps = disease?.TreatmentSteps?
                        .OrderBy(t => t.StepNumber)
                        .ToList() ?? new List<TreatmentStep>()
                };

                return View("DiseaseResult", viewModel);
            }
        }


        [HttpGet]
        public async Task<IActionResult> CheckApiStatus()
        {
            try
            {
                var httpClient = HttpContext.RequestServices
                    .GetRequiredService<IHttpClientFactory>()
                    .CreateClient();

                var response = await httpClient.GetAsync("http://127.0.0.1:5000/api/health");
                return Json(new { online = response.IsSuccessStatusCode });
            }
            catch
            {
                return Json(new { online = false });
            }
        }

        [HttpPost]
        public ActionResult DeleteScan(int id)
        {
            try
            {
                // 1. ابحث عن نتيجة التحليل المرتبطة بالـ UploadId واحذفها الأول (لتجنب أيرور الـ Foreign Key)
                var relatedResult = _context.AnalysisResults.FirstOrDefault(r => r.UploadId == id); // تأكد من اسم عمود الـ Foreign Key عندك (مثلاً UploadId)
                if (relatedResult != null)
                {
                    _context.AnalysisResults.Remove(relatedResult);
                }

                // 2. ابحث عن الفحص نفسه في جدول الـ Uploads باستخدام الـ id
                var upload = _context.Uploads.FirstOrDefault(u => u.Id == id); // غير "Uploads" لاسم الـ DbSet الحقيقي عندك في الـ Context

                if (upload == null)
                {
                    return Json(new { success = false, message = "Upload not found in database." });
                }

                // 3. حذف الـ Upload وحفظ التغييرات
                _context.Uploads.Remove(upload);
                _context.SaveChanges();

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }


        public IActionResult Archive()
        {
            var plantsList = _context.Plants.ToList();

            var insectsList = _context.Insects.ToList();

            ViewBag.Plants = plantsList;
            ViewBag.Insects = insectsList;

            return View();
        }
        [HttpGet]
        public async Task<IActionResult> Profile()
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return RedirectToAction("Login", "Account");
            }
            var model = new SmartAgricultuer.ViewModels.ProfileViewModel
            {
                FullName = user.Name,
                Email = user.Email
            };

            return View(model);
        }
        public IActionResult newpassword() => View();



    }
}