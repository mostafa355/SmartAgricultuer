using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartAgricultuer.Models;
using SmartAgricultuer.Services;
using SmartAgriculture.ViewModels;
using System.Security.Claims;
using Microsoft.AspNetCore.Hosting;


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
        private readonly IWebHostEnvironment _webHostEnvironment;

        // دمج كل الخدمات في Constructor واحد فقط
        public UserPanel(
            IImageService imageService,
            IDiagnosisService diagnosisService,
            IHistoryService historyService,
            AppdbContext context,
            UserManager<ApplicationUser> userManager,
            IWebHostEnvironment webHostEnvironment) // أضفنا الـ userManager هنا
            : base(historyService)
        {
            _imageService = imageService;
            _diagnosisService = diagnosisService;
            _historyService = historyService;
            _context = context;
            _userManager = userManager; // قمنا بتهيئة المتغير هنا
            _webHostEnvironment = webHostEnvironment; // قمنا بتهيئة المتغير هنا
        }

        public IActionResult Home() => View();

        public IActionResult Upload() => View();

        [HttpPost]
        public async Task<IActionResult> Result(IFormFile fileInput, bool isInsect)
        {
            if (fileInput == null)
            {
                TempData["Error"] = "Please add a photo.";
                return RedirectToAction("Upload");
            }

            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                int analysisTypeId = isInsect ? 2 : 1;
                string folder = isInsect ? "Insects" : "Plants";

                int uploadId; 

                if (isInsect)
                {

                    var insectResult = await _diagnosisService.DiagnoseInsectAsync(fileInput);

                    if (insectResult == null ||
                        insectResult.ConfidencePct < 60 ||
                        insectResult.Detected == "Not_Insect" ||
                        insectResult.Type == "Not_Insect")
                    {
                        TempData["Error"] = "Sorry, the image is unclear, or the insect could not be accurately identified. Please upload a clearer image.";
                        return RedirectToAction("Upload"); 
                    }


                    string? imagePath = await _imageService.SaveImageAsync(fileInput, folder);
                    if (imagePath == null)
                    {
                        TempData["Error"] = "There's a problem uploading the image.";
                        return RedirectToAction("Upload");
                    }

                    uploadId = await _historyService.SaveUploadAsync(userId, analysisTypeId, imagePath);
                    await _historyService.SaveInsectResultAsync(uploadId, insectResult);
                }
                else
                {
                    var plantResult = await _diagnosisService.DiagnosePlantAsync(fileInput);

                    if (plantResult == null ||
                        plantResult.ConfidencePct < 60 ||
                        plantResult.Plant == "Background_without_leaves" ||
                        plantResult.Disease == "Background_without_leaves")
                    {
                        TempData["Error"] = "Sorry, the image is unclear, or the plant could not be accurately identified. Please upload a clearer image.";
                        return RedirectToAction("Upload"); 
                    }

                    string? imagePath = await _imageService.SaveImageAsync(fileInput, folder);
                    if (imagePath == null)
                    {
                        TempData["Error"] = "There's a problem uploading the image.";
                        return RedirectToAction("Upload");
                    }

                    uploadId = await _historyService.SaveUploadAsync(userId, analysisTypeId, imagePath);
                    await _historyService.SavePlantResultAsync(uploadId, plantResult);
                }

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

                var response = await httpClient.GetAsync("https://tribesman-unworldly-calorie.ngrok-free.dev/api/health");
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
                Email = user.Email,
                ProfilePicture = user.ProfilePicture
            };

            return View(model);
        }
        [HttpPost]
        public async Task<IActionResult> UploadProfilePicture(IFormFile file)
        {
            if (file != null && file.Length > 0)
            {
                try
                {
                    // 1. تحديد مسار الفولدر داخل wwwroot التابع للمشروع لقراءة وحفظ الصور
                    string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "Uploads", "Profiles");

                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(fileStream);
                    }

                    var user = await _userManager.GetUserAsync(User);
                    if (user != null)
                    {
                        if (!string.IsNullOrEmpty(user.ProfilePicture))
                        {
                            string oldFilePath = Path.Combine(uploadsFolder, user.ProfilePicture);
                            if (System.IO.File.Exists(oldFilePath))
                            {
                                System.IO.File.Delete(oldFilePath);
                            }
                        }

                        user.ProfilePicture = uniqueFileName;
                        var result = await _userManager.UpdateAsync(user);

                        if (result.Succeeded)
                        {
                            return Json(new { success = true, imagePath = "/Uploads/Profiles/" + uniqueFileName });
                        }
                    }

                    return Json(new { success = false, message = "Failed to update database." });
                }
                catch (Exception ex)
                {
                    return Json(new { success = false, message = ex.Message });
                }
            }

            return Json(new { success = false, message = "No file selected." });
        }
        [HttpPost]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Value))
            {
                return Json(new { success = false, message = "Invalid data submitted." });
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Json(new { success = false, message = "User not found." });
            }

            if (request.Type == "name")
            {
                user.Name = request.Value; // تحديث الاسم (تأكد إن اسم الخاصية عندك في الـ ApplicationUser هو Name)
            }
            else if (request.Type == "email")
            {
                // تحديث الإيميل والـ UserName الخاص بالـ Identity
                user.Email = request.Value;
                user.NormalizedEmail = request.Value.ToUpper();
                user.UserName = request.Value;
                user.NormalizedUserName = request.Value.ToUpper();
            }
            else
            {
                return Json(new { success = false, message = "Invalid update type." });
            }

            // حفظ التعديلات في قاعدة البيانات
            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Json(new { success = true });
            }

            // لو حصل خطأ أثناء الحفظ (مثلاً الإيميل مستخدم قبل كده)
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            return Json(new { success = false, message = errors });
        }

        // كلاس صغير لاستقبال بيانات الـ JSON القادمة من الـ Fetch
        public class UpdateProfileRequest
        {
            public string Type { get; set; }
            public string Value { get; set; }
        }

        [HttpGet]
        public IActionResult newpassword()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken] 
        public async Task<IActionResult> newpassword(string currentPassword, string newPassword, string confirmPassword)
        {
            if (newPassword != confirmPassword)
                return Json(new { success = false, message = "New passwords do not match!" });

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
                return Json(new { success = false, message = "User not found." });

            var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);

            if (result.Succeeded)
            {
                return Json(new { success = true });
            }

            return Json(new { success = false, message = "Failed to update. Please check your current password." });
        }



    }
}