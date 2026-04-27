namespace SmartAgricultuer.Services
{
    public interface IDiagnosisService
    {
        // بتبعت مسار الصورة للـ Python API وترجع نتيجة التشخيص
        Task<DiagnosisResultDto> DiagnoseAsync(string imagePath, string type);
    }
}