using SmartAgricultuer.DTOs;

namespace SmartAgricultuer.Services
{
    public interface IDiagnosisService
    {
        // بتبعت الصورة للـ API وترجع النتيجة
        // type: "plant" أو "insect"
        Task<DiagnosisResultDto> DiagnoseAsync(IFormFile image, string type);
    }
}