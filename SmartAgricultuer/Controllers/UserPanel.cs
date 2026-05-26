using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartAgricultuer.Services;

namespace SmartAgricultuer.Controllers
{
    [Authorize(Roles = "User")]
    public class UserPanel : BaseController
    {
        private readonly IImageService _imageService;
        private readonly IDiagnosisService _diagnosisService;
        private readonly IHistoryService _historyService;

        public UserPanel(IImageService imageService, IDiagnosisService diagnosisService, IHistoryService historyService) : base(historyService)
        {
            _imageService = imageService;
            _diagnosisService = diagnosisService;
            _historyService = historyService;
        }
        // ...
        public IActionResult Home()
        {
            return View();
        }

        public IActionResult Upload()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Result(IFormFile fileInput, bool isInsect)
        {
            if (fileInput == null) return RedirectToAction("Upload");

            try
            {
                string folder = isInsect ? "Insects" : "Plants";
                string type = isInsect ? "insect" : "plant";

                var diagnosisResult = await _diagnosisService.DiagnoseAsync(fileInput, type);

                if (!diagnosisResult.Success)
                {
                    TempData["Error"] = diagnosisResult.Error;
                    return RedirectToAction("Upload");
                }

                string? imagePath = await _imageService.SaveImageAsync(fileInput, folder);

                if (imagePath == null)
                {
                    TempData["Error"] = "فيه مشكلة في رفع الصورة";
                    return RedirectToAction("Upload");
                }

                // جيب الـ User ID
                var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
                int analysisTypeId = isInsect ? 2 : 1;

                // احفظ في الداتابيز
                int uploadId = await _historyService.SaveUploadAsync(userId, analysisTypeId, imagePath);
                await _historyService.SaveAnalysisResultAsync(uploadId, diagnosisResult);

                // Redirect للـ Result بالـ id
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
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

            var result = await _historyService.GetHistoryByIdAsync(id, userId);

            if (result == null) return RedirectToAction("Upload");

            ViewBag.ImagePath = result.ImageUrl;
            ViewBag.Label = result.Label;
            ViewBag.IsHarmful = result.IsHarmful;
            ViewBag.Confidence = result.Confidence;
            ViewBag.IsInsect = result.AnalysisType == "Insect";
            ViewBag.ActiveId = id; // عشان السايد بار يعرف هو واقف على إيه

            return View();
        }
        public IActionResult Archive()
        {
            return View();
        }
    }
}