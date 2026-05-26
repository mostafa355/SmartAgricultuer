using System.Text.Json;
using SmartAgricultuer.DTOs;

namespace SmartAgricultuer.Services
{
    public class DiagnosisService : IDiagnosisService
    {
        private readonly HttpClient _httpClient;

        public DiagnosisService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            // رابط الـ Python API
            _httpClient.BaseAddress = new Uri("http://127.0.0.1:5000");
        }

        public async Task<DiagnosisResultDto> DiagnoseAsync(IFormFile image, string type)
        {
            try
            {
                // نسخ الصورة في الميموري الأول عشان نقدر نبعتها
                using var memoryStream = new MemoryStream();
                await image.CopyToAsync(memoryStream);
                memoryStream.Position = 0;

                var formData = new MultipartFormDataContent();
                var imageContent = new StreamContent(memoryStream);
                imageContent.Headers.ContentType =
                    new System.Net.Http.Headers.MediaTypeHeaderValue(image.ContentType);
                formData.Add(imageContent, "image", image.FileName);

                var endpoint = type == "insect"
                    ? "/api/detect/insect"
                    : "/api/detect/plant";

                var response = await _httpClient.PostAsync(endpoint, formData);
                var json = await response.Content.ReadAsStringAsync();

                // بنقرأ الـ JSON بشكل مرن
                var result = JsonSerializer.Deserialize<JsonElement>(json);

                bool success = result.GetProperty("success").GetBoolean();

                if (!success)
                    return new DiagnosisResultDto
                    {
                        Success = false,
                        Error = result.GetProperty("error").GetString()
                    };

                // بناء الـ Label حسب النوع
                string label;
                if (type == "insect")
                {
                    label = result.GetProperty("detected").GetString() ?? "Unknown";
                }
                else
                {
                    string plant = result.GetProperty("plant").GetString() ?? "Unknown";
                    string disease = result.GetProperty("disease").GetString() ?? "Unknown";
                    label = $"{plant}_{disease}";
                }

                return new DiagnosisResultDto
                {
                    Success = true,
                    Label = label,
                    IsHarmful = result.GetProperty("is_harmful").GetBoolean(),
                    ConfidencePct = result.GetProperty("confidence_pct").GetSingle()
                };
            }
            catch (Exception ex)
            {
                return new DiagnosisResultDto
                {
                    Success = false,
                    Error = ex.Message
                };
            }
        }
    }
}