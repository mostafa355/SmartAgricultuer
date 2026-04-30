namespace SmartAgricultuer.Services
{
    public class ImageService : IImageService
    {
        private readonly IWebHostEnvironment _environment;

        // بنجيب مسار الـ wwwroot من الـ DI
        public ImageService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public async Task<string?> SaveImageAsync(IFormFile image, string folder)
        {
            // التحقق إن الصورة موجودة ومش فارغة
            if (image == null || image.Length == 0)
                return null;

            // التحقق من نوع الصورة (jpg, jpeg, png فقط)
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
            var extension = Path.GetExtension(image.FileName).ToLower();
            if (!allowedExtensions.Contains(extension))
                return null;

            // التحقق من حجم الصورة (أقصى 5 ميجا)
            if (image.Length > 10 * 1024 * 1024)
                return null;

            // إنشاء اسم فريد للصورة عشان منبقاش نحفظ نفس الاسم
            var fileName = $"{Guid.NewGuid()}{extension}";

            // تحديد مسار الفولدر داخل wwwroot
            var folderPath = Path.Combine(_environment.WebRootPath, "uploads", folder);

            // إنشاء الفولدر لو مش موجود
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            // المسار الكامل للصورة
            var filePath = Path.Combine(folderPath, fileName);

            // حفظ الصورة على السيرفر
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            // إرجاع المسار النسبي عشان نحفظه في الداتابيز
            return $"/uploads/{folder}/{fileName}";
        }

        public void DeleteImage(string imagePath)
        {
            // لو المسار فارغ مش هنعمل حاجة
            if (string.IsNullOrEmpty(imagePath))
                return;

            // تحويل المسار النسبي لمسار كامل على السيرفر
            var fullPath = Path.Combine(_environment.WebRootPath, imagePath.TrimStart('/'));

            // لو الملف موجود نمسحه
            if (File.Exists(fullPath))
                File.Delete(fullPath);
        }
    }
}