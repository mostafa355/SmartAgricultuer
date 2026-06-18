using SmartAgricultuer.DTOs;

namespace SmartAgricultuer.Services
{
    public interface IDiagnosisService
    {
        Task<PlantDiagnosisDto> DiagnosePlantAsync(IFormFile image);
        Task<InsectDiagnosisDto> DiagnoseInsectAsync(IFormFile image);
    }
}