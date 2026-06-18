using SmartAgricultuer.Models;
using System;
using System.Collections.Generic;

namespace SmartAgriculture.ViewModels
{
    public class DiseaseResultViewModel
    {
        public bool IsHarmful { get; set; }
        public string imgurl { get; set; }
        // ═══════════════════════════════════════
        // بيانات المرض (Disease)
        // ═══════════════════════════════════════
        public string DiseaseName { get; set; }
        public string DiseaseDescription { get; set; }
        public string Symptoms { get; set; }
        public string Causes { get; set; }
        public string Prevention { get; set; }
        public string PlantType { get; set; }
        public string DetectionStatus { get; set; }
        public float? Confidence { get; set; }

        // ═══════════════════════════════════════
        // بيانات النبات (Plant)
        // ═══════════════════════════════════════
        public string PlantName { get; set; }
        public string ScientificName { get; set; }
        public string PlantDescription { get; set; }
        public string GeneralCare { get; set; }

        // ═══════════════════════════════════════
        // خطوات العلاج (Treatment Steps - To Do List)
        // ═══════════════════════════════════════
        public List<TreatmentStep> TreatmentSteps { get; set; } = new List<TreatmentStep>();
    }
}