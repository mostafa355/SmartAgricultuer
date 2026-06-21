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
            _httpClient.BaseAddress = new Uri("https://tribesman-unworldly-calorie.ngrok-free.dev/api/health");
        }

        private async Task<string> SendImageAsync(IFormFile image, string endpoint)
        {
            using var memoryStream = new MemoryStream();
            await image.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            var formData = new MultipartFormDataContent();
            var imageContent = new StreamContent(memoryStream);
            imageContent.Headers.ContentType =
                new System.Net.Http.Headers.MediaTypeHeaderValue(image.ContentType);
            formData.Add(imageContent, "image", image.FileName);

            var response = await _httpClient.PostAsync(endpoint, formData);
            return await response.Content.ReadAsStringAsync();
        }

        public async Task<PlantDiagnosisDto> DiagnosePlantAsync(IFormFile image)
        {
            try
            {
                var json = await SendImageAsync(image, "/api/detect/plant");
                var result = JsonSerializer.Deserialize<JsonElement>(json);

                bool success = result.GetProperty("success").GetBoolean();
                if (!success)
                    return new PlantDiagnosisDto
                    {
                        Success = false,
                        Error = result.GetProperty("error").GetString()
                    };

                return new PlantDiagnosisDto
                {
                    Success = true,
                    Detected = result.GetProperty("detected").GetString(),
                    Plant = result.GetProperty("plant").GetString(),
                    Disease = result.GetProperty("disease").GetString(),
                    Status = result.GetProperty("status").GetString(),
                    IsHarmful = result.GetProperty("is_harmful").GetBoolean(),
                    ConfidencePct = result.GetProperty("confidence_pct").GetSingle()
                };
            }
            catch (Exception ex)
            {
                return new PlantDiagnosisDto { Success = false, Error = ex.Message };
            }
        }

        public async Task<InsectDiagnosisDto> DiagnoseInsectAsync(IFormFile image)
        {
            try
            {
                var json = await SendImageAsync(image, "/api/detect/insect");
                var result = JsonSerializer.Deserialize<JsonElement>(json);

                bool success = result.GetProperty("success").GetBoolean();
                if (!success)
                    return new InsectDiagnosisDto
                    {
                        Success = false,
                        Error = result.GetProperty("error").GetString()
                    };

                return new InsectDiagnosisDto
                {
                    Success = true,
                    Detected = result.GetProperty("detected").GetString(),
                    Type = result.GetProperty("type").GetString(),
                    IsHarmful = result.GetProperty("is_harmful").GetBoolean(),
                    ConfidencePct = result.GetProperty("confidence_pct").GetSingle()
                };
            }
            catch (Exception ex)
            {
                return new InsectDiagnosisDto { Success = false, Error = ex.Message };
            }
        }
    }
}