namespace SmartAgricultuer.Services
{
    internal class DetectionHistory
    {
        public int UserId { get; set; }
        public string ImagePath { get; set; }
        public string Type { get; set; }
        public object DiseaseName { get; set; }
        public object IsHealthy { get; set; }
        public object Confidence { get; set; }
        public object Treatment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}