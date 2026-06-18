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
            return upload.Id;
        }

        public async Task SavePlantResultAsync(int uploadId, PlantDiagnosisDto result)
        {
            // البحث عن النبات بالاسم
            var plant = await _context.Plants
                .FirstOrDefaultAsync(p => p.Name == result.Plant);

            // البحث عن المرض بدمج النبات والمرض
            // الـ API بيرجع "Black_rot" والداتابيز فيها "Grape_Black_rot"
            string fullDiseaseName = $"{result.Plant}_{result.Disease}";

            var disease = await _context.PlantDiseases
                .FirstOrDefaultAsync(d => d.Name == fullDiseaseName
                                       || d.Name == result.Disease);

            var analysisResult = new AnalysisResult
            {
                UploadId = uploadId,
                DetectedPlantId = plant?.Id,
                DetectedDiseaseId = disease?.Id,
                IsDiseased = result.IsHarmful,
                ConfidenceScore = (decimal)result.ConfidencePct,
                AnalyzedAt = DateTime.UtcNow
            };

            await _context.AnalysisResults.AddAsync(analysisResult);
            await _context.SaveChangesAsync();
        }

        public async Task SaveInsectResultAsync(int uploadId, InsectDiagnosisDto result)
        {
            // البحث عن الحشرة في الداتابيز
            var insect = await _context.Insects
                .FirstOrDefaultAsync(i => i.Name == result.Detected);

            var analysisResult = new AnalysisResult
            {
                UploadId = uploadId,
                DetectedInsectId = insect?.Id,
                IsDiseased = result.IsHarmful,
                ConfidenceScore = (decimal)result.ConfidencePct,
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

            upload.IsDeleted = true;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}