namespace SmartAgricultuer.DTOs
{
    public class HistoryDto
    {
        public int Id { get; set; }

        // مسار الصورة
        public string ImageUrl { get; set; } = string.Empty;

        // نوع التشخيص (Plant / Insect)
        public string AnalysisType { get; set; } = string.Empty;

        // اسم النبات
        public string? PlantName { get; set; }

        // اسم المرض
        public string? DiseaseName { get; set; }

        // اسم الحشرة
        public string? InsectName { get; set; }

        // هل النبات سليم؟
        public bool? IsDiseased { get; set; }

        // نسبة الثقة
        public decimal? Confidence { get; set; }

        // تاريخ التشخيص
        public DateTime? CreatedAt { get; set; }
    }
}