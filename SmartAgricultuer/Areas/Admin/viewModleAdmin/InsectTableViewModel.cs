namespace SmartAgricultuer.ViewModels
{
    public class InsectTableViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ScientificName { get; set; } = "Unknown";
        public string AffectedPlants { get; set; } = "All Crops";
        public string DamageType { get; set; } = "No severe damage recorded.";
        public string Status { get; set; } = "Controlled"; // Harmful, Warning, Controlled
        public string ImageUrl { get; set; } = string.Empty;
    }
}