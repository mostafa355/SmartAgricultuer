namespace SmartAgricultuer.DTOs
{
    public class InsectDiagnosisDto
    {
        public bool Success { get; set; }
        public string? Detected { get; set; }  // "Bee"
        public string? Type { get; set; }       // "Harmful" / "Beneficial"
        public bool IsHarmful { get; set; }
        public float ConfidencePct { get; set; }
        public string? Error { get; set; }
    }
}