namespace SmartAgricultuer.Services
{
    public interface IImageService
    {
        // بتاخد الصورة وترجع مسارها لو نجحت، أو null لو فشلت
        Task<string?> SaveImageAsync(IFormFile image, string folder);

        // بتمسح الصورة من السيرفر
        void DeleteImage(string imagePath);
    }
}