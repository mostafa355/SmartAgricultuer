using Microsoft.EntityFrameworkCore;
using SmartAgricultuer.DTOs;
using SmartAgricultuer.Models;

namespace SmartAgricultuer.Services
{
    public class HistoryService : IHistoryService
    {
        private readonly AppdbContext _context;

        public HistoryService(AppdbContext context)
        {
            _context = context;
        }

        public async Task<List<HistoryDto>> GetUserHistoryAsync(int userId)
        {
            // جلب كل الـ Uploads بتاعت الـ User مع نتائجها
            return await _context.Uploads
                .Where(u => u.UserId == userId && u.IsDeleted != true)
                .OrderByDescending(u => u.CreatedAt)
                .Select(u => new HistoryDto
                {
                    Id = u.Id,
                    ImageUrl = u.ImageUrl,
                    AnalysisType = u.AnalysisType.Name,
                    PlantName = u.AnalysisResults
                        .Select(r => r.DetectedPlant.Name)
                        .FirstOrDefault(),
                    DiseaseName = u.AnalysisResults
                        .Select(r => r.DetectedDisease.Name)
                        .FirstOrDefault(),
                    InsectName = u.AnalysisResults
                        .Select(r => r.DetectedInsect.Name)
                        .FirstOrDefault(),
                    IsDiseased = u.AnalysisResults
                        .Select(r => r.IsDiseased)
                        .FirstOrDefault(),
                    Confidence = u.AnalysisResults
                        .Select(r => r.ConfidenceScore)
                        .FirstOrDefault(),
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<HistoryDto?> GetHistoryByIdAsync(int id, int userId)
        {
            // جلب سجل معين مع التأكد إنه بتاع الـ User ده بس
            return await _context.Uploads
                .Where(u => u.Id == id && u.UserId == userId && u.IsDeleted != true)
                .Select(u => new HistoryDto
                {
                    Id = u.Id,
                    ImageUrl = u.ImageUrl,
                    AnalysisType = u.AnalysisType.Name,
                    PlantName = u.AnalysisResults
                        .Select(r => r.DetectedPlant.Name)
                        .FirstOrDefault(),
                    DiseaseName = u.AnalysisResults
                        .Select(r => r.DetectedDisease.Name)
                        .FirstOrDefault(),
                    InsectName = u.AnalysisResults
                        .Select(r => r.DetectedInsect.Name)
                        .FirstOrDefault(),
                    IsDiseased = u.AnalysisResults
                        .Select(r => r.IsDiseased)
                        .FirstOrDefault(),
                    Confidence = u.AnalysisResults
                        .Select(r => r.ConfidenceScore)
                        .FirstOrDefault(),
                    CreatedAt = u.CreatedAt
                })
                .FirstOrDefaultAsync();
        }

        public async Task<int> SaveUploadAsync(int userId, int analysisTypeId, string imageUrl)
        {
            // إنشاء Upload جديد وحفظه
            var upload = new Upload
            {
                UserId = userId,
                AnalysisTypeId = analysisTypeId,
                ImageUrl = imageUrl,
                IsDeleted = false,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Uploads.AddAsync(upload);
            await _context.SaveChangesAsync();

            // بنرجع الـ Id عشان نستخدمه في حفظ الـ AnalysisResult
            return upload.Id;
        }

        public async Task SaveAnalysisResultAsync(int uploadId, DiagnosisResultDto result)
        {
            var analysisResult = new AnalysisResult
            {
                UploadId = uploadId,
                IsDiseased = result.IsHarmful,           // ← IsHealthy اتغير لـ IsHarmful
                ConfidenceScore = (decimal)result.ConfidencePct,  // ← Confidence اتغير لـ ConfidencePct
                AnalyzedAt = DateTime.UtcNow
            };

            await _context.AnalysisResults.AddAsync(analysisResult);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteHistoryAsync(int id, int userId)
        {
            var upload = await _context.Uploads
                .FirstOrDefaultAsync(u => u.Id == id && u.UserId == userId);

            if (upload == null) return false;

            // Soft Delete بدل ما نمسح الداتا فعلاً
            upload.IsDeleted = true;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}