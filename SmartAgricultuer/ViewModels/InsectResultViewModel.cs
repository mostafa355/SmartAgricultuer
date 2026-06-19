using SmartAgricultuer.Models;

namespace SmartAgriculture.ViewModels
{
    public class InsectResultViewModel
    {
        public string? imgurl { get; set; }
        public float? Confidence { get; set; }
        public bool IsHarmful { get; set; }

        // بيانات الحشرة
        public string? InsectName { get; set; }
        public string? ScientificName { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
        public string? Prevention { get; set; }
        public string? ImageUrl { get; set; }

        // النباتات المتأثرة مباشرة من الـ Model
        public List<InsectPlant>? AffectedPlants { get; set; }

        // خطوات المكافحة
        public List<TreatmentStep>? TreatmentSteps { get; set; } = new List<TreatmentStep>();
    }
}