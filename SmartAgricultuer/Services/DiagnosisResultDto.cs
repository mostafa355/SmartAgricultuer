namespace SmartAgricultuer.Services
{
    public class DiagnosisResultDto
    {
        public bool IsSuccess { get; internal set; }
        public string ErrorMessage { get; internal set; }
        public object IsHealthy { get; internal set; }
        public object DiseaseName { get; internal set; }
        public object Confidence { get; internal set; }
    }
}