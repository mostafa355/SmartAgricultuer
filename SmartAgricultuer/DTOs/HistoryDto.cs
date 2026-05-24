namespace SmartAgricultuer.DTOs
{
    public class HistoryDto
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string AnalysisType { get; set; } = string.Empty;
        public string? PlantName { get; set; }
        public string? DiseaseName { get; set; }
        public string? InsectName { get; set; }
        public bool? IsDiseased { get; set; }
        public decimal? Confidence { get; set; }
        public DateTime? CreatedAt { get; set; }

        // ← أضف دول
        public string? Label => AnalysisType == "Insect"
            ? InsectName
            : $"{PlantName}_{DiseaseName}";

        public bool IsHarmful => IsDiseased ?? false;
    }
}