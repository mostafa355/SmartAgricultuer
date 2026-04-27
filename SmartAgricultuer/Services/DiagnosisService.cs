using System.Text.Json;
using SmartAgricultuer.DTOs;

namespace SmartAgricultuer.Services
{
    public class DiagnosisService : IDiagnosisService
    {
        private readonly HttpClient _httpClient;
        private readonly IWebHostEnvironment _environment;
        private readonly IConfiguration _configuration;

        public DiagnosisService(HttpClient httpClient,
                                IWebHostEnvironment environment,
                                IConfiguration configuration)
        {
            _httpClient = httpClient;
            _environment = environment;
            _configuration = configuration;
        }

        public async Task<DiagnosisResultDto> DiagnoseAsync(string imagePath, string type)
        {
            try
            {
                // تحويل المسار النسبي لمسار كامل على السيرفر
                var fullPath = Path.Combine(_environment.WebRootPath, imagePath.TrimStart('/'));

                // التحقق إن الصورة موجودة
                if (!File.Exists(fullPath))
                    return new DiagnosisResultDto
                    {
                        IsSuccess = false,
                        ErrorMessage = "الصورة مش موجودة"
                    };

                // قراءة الصورة وتحضيرها للإرسال
                var imageBytes = await File.ReadAllBytesAsync(fullPath);
                var imageContent = new ByteArrayContent(imageBytes);
                imageContent.Headers.ContentType =
                    new System.Net.Http.Headers.MediaTypeHeaderValue("image/jpeg");

                // تحضير الـ Form Data للإرسال
                var formData = new MultipartFormDataContent();
                formData.Add(imageContent, "file", Path.GetFileName(fullPath));
                formData.Add(new StringContent(type), "type");

                // جلب رابط الـ Python API من الـ appsettings.json
                var apiUrl = _configuration["PythonApi:Url"] ?? "http://localhost:5000/diagnose";

                // إرسال الصورة للـ Python API
                var response = await _httpClient.PostAsync(apiUrl, formData);

                if (!response.IsSuccessStatusCode)
                    return new DiagnosisResultDto
                    {
                        IsSuccess = false,
                        ErrorMessage = "الـ API مش شغال"
                    };

                // قراءة النتيجة
                var json = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<DiagnosisResultDto>(json,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                result!.IsSuccess = true;
                return result;
            }
            catch (Exception ex)
            {
                return new DiagnosisResultDto
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }
    }
}