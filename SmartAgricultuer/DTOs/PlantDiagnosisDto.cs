namespace SmartAgricultuer.DTOs
{
    public class PlantDiagnosisDto
    {
        public bool Success { get; set; }
        public string? Detected { get; set; }  // "Tomato___Early_blight"
        public string? Plant { get; set; }      // "Tomato"
        public string? Disease { get; set; }    // "Early_blight"
        public string? Status { get; set; }     // "Diseased" / "Healthy"
        public bool IsHarmful { get; set; }
        public float ConfidencePct { get; set; }
        public string? Error { get; set; }
    }
}