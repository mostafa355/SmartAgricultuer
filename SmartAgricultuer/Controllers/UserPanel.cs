using Microsoft.AspNetCore.Mvc;
using SmartAgricultuer.Services;

namespace SmartAgricultuer.Controllers
{
    public class UserPanel : BaseController
    {
        // 1. تعريف المتغير اللي هيشيل الخدمة
        private readonly IImageService _imageService;

        // 2. عمل الـ Constructor لحقن الخدمة
        public UserPanel(IImageService imageService)
        {
            _imageService = imageService;
        }
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
                string? imagePath = await _imageService.SaveImageAsync(fileInput, folder);

                if (imagePath == null)
                {
                    TempData["Error"] = "فيه مشكلة في رفع الصورة";
                    return RedirectToAction("Upload");
                }

                ViewBag.ImagePath = imagePath;
                return View();
            }
            catch (Exception ex)
            {
                // هنشوف الـ Error الحقيقي بدل ما المشروع يكسر
                TempData["Error"] = ex.Message;
                return RedirectToAction("Upload");
            }
        }
        public IActionResult Archive()
        {
            return View();
        }
    }
}
