using SmartAgricultuer.DTOs;

namespace SmartAgricultuer.Services
{
    public interface IHistoryService
    {
        // جلب كل سجلات المستخدم
        Task<List<HistoryDto>> GetUserHistoryAsync(int userId);

        // جلب تفاصيل سجل معين
        Task<HistoryDto?> GetHistoryByIdAsync(int id, int userId);

        // حفظ Upload جديد
        Task<int> SaveUploadAsync(int userId, int analysisTypeId, string imageUrl);

        // حفظ نتيجة تشخيص نبات
        Task SavePlantResultAsync(int uploadId, PlantDiagnosisDto result);

        // حفظ نتيجة تشخيص حشرة
        Task SaveInsectResultAsync(int uploadId, InsectDiagnosisDto result);

        // حذف سجل
        Task<bool> DeleteHistoryAsync(int id, int userId);
    }
}