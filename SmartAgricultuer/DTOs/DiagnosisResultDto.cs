// DTOs/DiagnosisResultDto.cs
namespace SmartAgricultuer.DTOs
{
    public class DiagnosisResultDto
    {
        // اسم المرض أو الحشرة
        public string DiseaseName { get; set; } = string.Empty;

        // هل النبات سليم؟
        public bool IsHealthy { get; set; }

        // نسبة الثقة في التشخيص
        public float Confidence { get; set; }

        // خطوات العلاج
        public string Treatment { get; set; } = string.Empty;

        // هل التشخيص نجح؟
        public bool IsSuccess { get; set; }

        // رسالة الخطأ لو فشل
        public string? ErrorMessage { get; set; }
    }
}