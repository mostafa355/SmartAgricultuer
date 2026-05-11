namespace SmartAgricultuer.DTOs
{
    public class DiagnosisResultDto
    {
        // هل العملية نجحت؟
        public bool Success { get; set; }

        // اسم النبات أو الحشرة _ اسم المرض
        // مثال: "Tomato_Early Blight" أو "Bee"
        public string? Label { get; set; }

        // مريض/ضار ولا لا
        public bool IsHarmful { get; set; }

        // نسبة الثقة
        public float ConfidencePct { get; set; }

        // رسالة الخطأ لو فشل
        public string? Error { get; set; }
    }
}