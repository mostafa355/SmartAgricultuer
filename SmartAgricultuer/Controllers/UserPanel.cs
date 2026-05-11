using Microsoft.AspNetCore.Mvc;
using SmartAgricultuer.Services;

namespace SmartAgricultuer.Controllers
{
    public class UserPanel : BaseController
    {
        private readonly IImageService _imageService;
        private readonly IDiagnosisService _diagnosisService;

        public UserPanel(IImageService imageService, IDiagnosisService diagnosisService)
        {
            _imageService = imageService;
            _diagnosisService = diagnosisService;
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

                Console.WriteLine($"✅ Success: {diagnosisResult.Success}");
                Console.WriteLine($"🏷️ Label: {diagnosisResult.Label}");
                Console.WriteLine($"⚠️ IsHarmful: {diagnosisResult.IsHarmful}");
                Console.WriteLine($"📊 Confidence: {diagnosisResult.ConfidencePct}");

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

                ViewBag.ImagePath = imagePath;
                ViewBag.Label = diagnosisResult.Label;
                ViewBag.IsHarmful = diagnosisResult.IsHarmful;
                ViewBag.Confidence = diagnosisResult.ConfidencePct;
                ViewBag.IsInsect = isInsect;

                return View();
            }
            catch (Exception ex)
            {
                TempData["Error"] = $"{ex.Message} | {ex.InnerException?.Message}";
                return RedirectToAction("Upload");
            }
        }
        public IActionResult Archive()
        {
            return View();
        }
    }
}
