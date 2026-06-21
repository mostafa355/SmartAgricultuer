namespace SmartAgricultuer.ViewModels
{
    public class AdminDashboardViewModel
    {
        // الكروت العلوية
        public int TotalUsers { get; set; }
        public int TotalUploads { get; set; }
        public int TotalAnalyses { get; set; }
        public int DiseasedPlants { get; set; }
        public int HealthyPlants { get; set; }
        public int InsectDetections { get; set; }

        // متوسط ثقة الموديل
        public double AvgConfidence { get; set; }

        // توزيع صحة النبات (للـ Donut Chart)
        public double HealthyPct { get; set; }
        public double DiseasedPct { get; set; }
        public double InsectPct { get; set; }

        // أكثر الأمراض اكتشافاً
        public List<DiseaseStatItem> TopDiseases { get; set; } = new();

        // أكثر الحشرات شيوعاً
        public List<InsectStatItem> TopInsects { get; set; } = new();

        // أكثر النباتات تحليلاً
        public List<PlantStatItem> TopPlants { get; set; } = new();

        // النشاط اليومي آخر 7 أيام
        public List<DailyActivityItem> WeeklyActivity { get; set; } = new();

        // آخر العمليات
        public List<RecentActivityItem> RecentActivity { get; set; } = new();
    }

    public class DiseaseStatItem
    {
        public string Name { get; set; } = "";
        public int Count { get; set; }
        public double Percentage { get; set; }
    }

    public class InsectStatItem
    {
        public string Name { get; set; } = "";
        public int Count { get; set; }
        public string? Status { get; set; }
    }

    public class PlantStatItem
    {
        public string Name { get; set; } = "";
        public int Count { get; set; }
        public double Percentage { get; set; }
    }

    public class DailyActivityItem
    {
        public string DayLabel { get; set; } = "";
        public int Uploads { get; set; }
        public int Users { get; set; }
    }

    public class RecentActivityItem
    {
        public string UserName { get; set; } = "";
        public string? PlantName { get; set; }
        public string? ScientificName { get; set; }
        public string ResultLabel { get; set; } = "";
        public bool IsHealthy { get; set; }
        public decimal? Confidence { get; set; }
        public DateTime? Date { get; set; }
    }
}