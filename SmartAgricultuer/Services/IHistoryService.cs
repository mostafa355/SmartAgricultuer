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

        // حفظ نتيجة التشخيص
        Task SaveAnalysisResultAsync(int uploadId, DiagnosisResultDto result);

        // حذف سجل
        Task<bool> DeleteHistoryAsync(int id, int userId);
    }
}