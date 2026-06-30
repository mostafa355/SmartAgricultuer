using Grpc.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartAgricultuer.Models;
using SmartAgricultuer.ViewModels;
using Microsoft.AspNetCore.Hosting;
using SmartAgricultuer.ViewModelsAdmin;

namespace SmartAgricultuer.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize]
    public class AdminPanelController : Controller
    {
        private readonly AppdbContext _context;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public AdminPanelController(
            AppdbContext context,
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager,
            IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _signInManager = signInManager;
            _userManager = userManager;
            _webHostEnvironment = webHostEnvironment;
        }

        public IActionResult table_plant()
        {
            return View();
        }

        public IActionResult Add_plant()
        {
            return View();
        }

        public IActionResult adddisease()
        {
            return View();
        }
        [HttpGet]
        public IActionResult Add_Insects()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Add_Insects(InsectFormViewModel model)
        {
            if (model == null || string.IsNullOrEmpty(model.Name))
            {
                return Json(new { success = false, message = "Submitted data is invalid. Insect Name is required." });
            }

            try
            {
                string dbImagePath = "ImageSource/Insects/default.png";

                if (!string.IsNullOrEmpty(model.ImageBase64))
                {
                    string base64Data = model.ImageBase64;
                    if (base64Data.Contains(","))
                    {
                        base64Data = base64Data.Split(',')[1];
                    }

                    byte[] imageBytes = Convert.FromBase64String(base64Data);
                    string folderPath = Path.Combine(_webHostEnvironment.WebRootPath, "ImageSource", "Insects");

                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }

                    string uniqueFileName = Guid.NewGuid().ToString() + ".png";
                    string fullPath = Path.Combine(folderPath, uniqueFileName);

                    System.IO.File.WriteAllBytes(fullPath, imageBytes);
                    dbImagePath = "ImageSource/Insects/" + uniqueFileName;
                }


                string finalDescription = model.Status == "Harmful" ? (model.DamageDescription ?? "") : "No damage - Beneficial insect.";
                string finalPrevention = model.PreventionMethod ?? "";
                string finalSciName = model.ScientificName ?? "";

                var newInsect = new Insect
                {
                    Name = model.Name,
                    ScientificName = finalSciName,
                    Description = finalDescription,
                    Prevention = finalPrevention,
                    Status = model.Status,
                    ImageUrl = dbImagePath,
                    IsDeleted = false,
                    CreatedAt = DateTime.Now
                };

                _context.Insects.Add(newInsect);
                _context.SaveChanges();

                if (model.Status == "Harmful" && model.AffectedPlants != null && model.AffectedPlants.Count > 0)
                {
                    foreach (var plantName in model.AffectedPlants)
                    {
                        if (string.IsNullOrEmpty(plantName)) continue;

                        var plant = _context.Plants.FirstOrDefault(p => p.Name.ToLower() == plantName.ToLower());

                        if (plant == null)
                        {
                            plant = new Plant
                            {
                                Name = plantName,
                                IsDeleted = false,
                                CreatedAt = DateTime.Now
                            };
                            _context.Plants.Add(plant);
                            _context.SaveChanges();
                        }

                        var relation = new InsectPlant
                        {
                            InsectId = newInsect.Id,
                            PlantId = plant.Id,
                            DamageType = finalDescription
                        };

                        _context.InsectPlants.Add(relation);
                    }
                    _context.SaveChanges();
                }

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public ActionResult Delete_Insect(int id)
        {
            try
            {
                var insect = _context.Insects.FirstOrDefault(i => i.Id == id);
                if (insect != null)
                {
                    insect.IsDeleted = true;
                    _context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                TempData["Error"] = ex.Message;
            }

            return RedirectToAction("Insects");
        }
        [HttpGet]
        public async Task<IActionResult> Edit_Insect(int id)
        {
            var insect = await _context.Insects
                .Include(i => i.InsectPlants)
                    .ThenInclude(ip => ip.Plant)
                .FirstOrDefaultAsync(i => i.Id == id && i.IsDeleted == false);

            if (insect == null) return RedirectToAction("Insects");

            var model = new InsectFormViewModel
            {
                Id = insect.Id,
                Name = insect.Name,
                ScientificName = insect.ScientificName,
                Status = insect.Status,
                DamageDescription = insect.Description,
                PreventionMethod = insect.Prevention,
                ImageBase64 = insect.ImageUrl,
                AffectedPlants = insect.InsectPlants
                    .Select(ip => ip.Plant.Name)
                    .ToList()
            };

            ViewBag.AllPlants = await _context.Plants
                .Where(p => p.IsDeleted != true)
                .Select(p => p.Name)
                .ToListAsync();

            return View(model);
        }
        [HttpPost]
        public ActionResult Edit_Insect(InsectFormViewModel model)
        {
            if (model == null || model.Id <= 0 || string.IsNullOrEmpty(model.Name))
            {
                return Json(new { success = false, message = "Submitted data is invalid." });
            }

            try
            {
                var insect = _context.Insects.FirstOrDefault(i => i.Id == model.Id && i.IsDeleted == false);
                if (insect == null)
                {
                    return Json(new { success = false, message = "Insect not found." });
                }

                if (!string.IsNullOrEmpty(model.ImageBase64))
                {
                    string base64Data = model.ImageBase64;
                    if (base64Data.Contains(","))
                    {
                        base64Data = base64Data.Split(',')[1];
                    }

                    byte[] imageBytes = Convert.FromBase64String(base64Data);
                    string folderPath = Path.Combine(_webHostEnvironment.WebRootPath, "ImageSource", "Insects");

                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }

                    string uniqueFileName = Guid.NewGuid().ToString() + ".png";
                    string fullPath = Path.Combine(folderPath, uniqueFileName);

                    System.IO.File.WriteAllBytes(fullPath, imageBytes);
                    insect.ImageUrl = "ImageSource/Insects/" + uniqueFileName;
                }

                string finalDescription = model.Status == "Harmful" ? (model.DamageDescription ?? "") : "No damage - Beneficial insect.";

                insect.Name = model.Name;
                insect.ScientificName = model.ScientificName ?? "";
                insect.Status = model.Status;
                insect.Description = finalDescription;
                insect.Prevention = model.PreventionMethod ?? "";

                _context.SaveChanges();

                var existingRelations = _context.InsectPlants.Where(ip => ip.InsectId == insect.Id).ToList();

                if (model.Status == "Harmful" && model.AffectedPlants != null && model.AffectedPlants.Count > 0)
                {
                    var incomingPlantNames = model.AffectedPlants.Where(p => !string.IsNullOrEmpty(p)).Select(p => p.Trim().ToLower()).ToList();

                    foreach (var relation in existingRelations)
                    {
                        var plant = _context.Plants.FirstOrDefault(p => p.Id == relation.PlantId);
                        if (plant == null || !incomingPlantNames.Contains(plant.Name.ToLower()))
                        {
                            _context.InsectPlants.Remove(relation);
                        }
                    }

                    foreach (var plantName in model.AffectedPlants)
                    {
                        if (string.IsNullOrEmpty(plantName)) continue;

                        var plant = _context.Plants.FirstOrDefault(p => p.Name.ToLower() == plantName.Trim().ToLower());

                        if (plant == null)
                        {
                            plant = new Plant
                            {
                                Name = plantName.Trim(),
                                IsDeleted = false,
                                CreatedAt = DateTime.Now
                            };
                            _context.Plants.Add(plant);
                            _context.SaveChanges(); 
                        }

                        var hasRelation = _context.InsectPlants.Any(ip => ip.InsectId == insect.Id && ip.PlantId == plant.Id);
                        if (!hasRelation)
                        {
                            var newRelation = new InsectPlant
                            {
                                InsectId = insect.Id,
                                PlantId = plant.Id,
                                DamageType = finalDescription
                            };
                            _context.InsectPlants.Add(newRelation);
                        }
                        else
                        {
                            var currentRelation = _context.InsectPlants.First(ip => ip.InsectId == insect.Id && ip.PlantId == plant.Id);
                            currentRelation.DamageType = finalDescription;
                        }
                    }
                }
                else
                {
                    if (existingRelations.Any())
                    {
                        _context.InsectPlants.RemoveRange(existingRelations);
                    }
                }

                _context.SaveChanges();
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> Profile()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return RedirectToAction("Login", "Account");
            }

            var model = new ProfileViewModel
            {
                FullName = user.UserName,
                Email = user.Email,
                ProfilePicture = user.ProfilePicture
            };

            return View(model);
        }

        [HttpPost]
        [Route("Admin/AdminPanel/UploadProfilePicture")]
        public async Task<IActionResult> UploadProfilePicture(IFormFile ProfilePictureFile)
        {
            if (ProfilePictureFile == null || ProfilePictureFile.Length == 0)
            {
                return Json(new { success = false, message = "No image file selected." });
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Json(new { success = false, message = "User not found." });
            }

            try
            {
                string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/profiles");
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                string uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(ProfilePictureFile.FileName);
                string filePath = Path.Combine(folderPath, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await ProfilePictureFile.CopyToAsync(stream);
                }

                string dbImagePath = "uploads/profiles/" + uniqueFileName;

                user.ProfilePicture = dbImagePath;
                var result = await _userManager.UpdateAsync(user);

                if (result.Succeeded)
                {
                    return Json(new { success = true, newImageUrl = Url.Content("~/" + dbImagePath) });
                }

                return Json(new { success = false, message = "Failed to update user database profile image." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error saving file: " + ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileViewModel model)
        {
            if (model == null || string.IsNullOrEmpty(model.FullName) || string.IsNullOrEmpty(model.Email))
            {
                return Json(new { success = false, message = "Invalid data provided." });
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Json(new { success = false, message = "User not found." });
            }

            user.UserName = model.FullName;
            user.Email = model.Email;

            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                return Json(new { success = true, message = "Profile updated successfully in Identity!" });
            }

            return Json(new { success = false, message = "Update failed: " + string.Join(", ", result.Errors.Select(e => e.Description)) });
        }

        [HttpPost]
        public async Task<IActionResult> ChangePassword(string oldPassword, string newPassword)
        {
            if (string.IsNullOrEmpty(oldPassword) || string.IsNullOrEmpty(newPassword))
            {
                return Json(new { success = false, message = "All password fields are required." });
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Json(new { success = false, message = "User not found." });
            }

            var result = await _userManager.ChangePasswordAsync(user, oldPassword, newPassword);
            if (result.Succeeded)
            {
                return Json(new { success = true, message = "Password changed successfully!" });
            }

            string errorMessage = string.Join(", ", result.Errors.Select(e => e.Description));
            return Json(new { success = false, message = errorMessage });
        }

        public async Task<IActionResult> Insects()
        {
            var insectsList = await _context.Insects
                .Where(i => i.IsDeleted != true)
                .Select(i => new InsectTableViewModel
                {
                    Id = i.Id,
                    Name = i.Name,
                    ScientificName = i.ScientificName ?? "Unknown",

                    AffectedPlants = i.InsectPlants != null && i.InsectPlants.Any()
                        ? string.Join(", ", i.InsectPlants.Select(ip => ip.Plant != null ? ip.Plant.Name : "Unknown Crop"))
                        : "All Flowering",

                    DamageType = i.InsectPlants != null && i.InsectPlants.Any()
                        ? string.Join(" | ", i.InsectPlants.Select(ip => ip.DamageType).Where(d => !string.IsNullOrEmpty(d)).Distinct())
                        : "None (Beneficial Pollinator)",

                    Status = i.Status ?? "Controlled",
                    ImageUrl = i.ImageUrl ?? ""
                })
                .ToListAsync();

            ViewBag.CriticalAlerts = insectsList.Count(i => i.Status == "Harmful");
            ViewBag.BeneficialSpecies = insectsList.Count(i => i.Status == "Beneficial");
            ViewBag.TotalSpecies = insectsList.Count;

            return View(insectsList);
        }

        public async Task<IActionResult> Diseases()
        {
            var diseasesList = await _context.PlantDiseases
                .Where(d => d.IsDeleted != true)
                .Select(d => new DiseaseTableViewModel
                {
                    Id = d.Id,
                    Name = d.Name,
                    PlantType = d.PlantType ?? (d.Plant != null ? d.Plant.Name : "Unknown"),
                    Symptoms = d.Symptoms ?? "No symptoms recorded.",
                    Status = d.DetectionStatus == null ? "Normal" : d.DetectionStatus,
                    ImageUrl = d.VisualEvidenceUrl ?? ""
                })
                .ToListAsync();

            ViewBag.CriticalAlerts = diseasesList.Count(d => d.Status == "High" || d.Status == "Critical");
            ViewBag.ModerateAlerts = diseasesList.Count(d => d.Status == "Moderate");
            ViewBag.LowAndNormal = diseasesList.Count(d => d.Status == "Low" || d.Status == "Normal");
            ViewBag.TotalPathogens = diseasesList.Count;

            return View(diseasesList);
        }

        public async Task<IActionResult> Plants()
        {
            var plants = await _context.Plants
                .Where(p => p.IsDeleted != true)
                .Include(p => p.PlantDiseases)
                .Include(p => p.InsectPlants)
                    .ThenInclude(ip => ip.Insect)
                .Select(p => new PlantTableViewModel
                {
                    Id = p.Id,
                    Name = p.Name,
                    Scientific = p.ScientificName,
                    ImageUrl = p.ImageUrl,
                    Diseases = p.PlantDiseases.Where(d => d.IsDeleted != true).Select(d => d.Name).ToList(),
                    Insects = p.InsectPlants.Select(ip => ip.Insect.Name).ToList()
                })
                .ToListAsync();

            return View(plants);
        }

        public async Task<IActionResult> Home_Analses()
        {
            var user = await _userManager.GetUserAsync(User);
            ViewBag.UserName = user?.UserName;
            ViewBag.ProfilePicture = user?.ProfilePicture;
            ViewBag.UserEmail = user?.Email;
            var totalUsers = await _context.Users.CountAsync();
            var uploads = await _context.Uploads.Where(u => u.IsDeleted != true).ToListAsync();
            var results = await _context.AnalysisResults.ToListAsync();

            int diseasedPlants = results.Count(r => r.DetectedPlantId != null && r.IsDiseased == true);
            int healthyPlants = results.Count(r => r.DetectedPlantId != null && r.IsDiseased == false);
            int insectDetections = results.Count(r => r.DetectedInsectId != null);
            int totalAnalyzedForChart = diseasedPlants + healthyPlants + insectDetections;

            var viewModel = new AdminDashboardViewModel
            {
                TotalUsers = totalUsers,
                TotalUploads = uploads.Count,
                TotalAnalyses = results.Count,
                DiseasedPlants = diseasedPlants,
                HealthyPlants = healthyPlants,
                InsectDetections = insectDetections,

                AvgConfidence = results.Any()
                    ? (double)results.Average(r => r.ConfidenceScore ?? 0)
                    : 0,

                HealthyPct = totalAnalyzedForChart > 0
                    ? Math.Round((double)healthyPlants / totalAnalyzedForChart * 100, 1) : 0,
                DiseasedPct = totalAnalyzedForChart > 0
                    ? Math.Round((double)diseasedPlants / totalAnalyzedForChart * 100, 1) : 0,
                InsectPct = totalAnalyzedForChart > 0
                    ? Math.Round((double)insectDetections / totalAnalyzedForChart * 100, 1) : 0,
            };

            var diseaseGroups = await _context.AnalysisResults
                .Where(r => r.DetectedDiseaseId != null)
                .Include(r => r.DetectedDisease)
                .GroupBy(r => r.DetectedDisease!.Name)
                .Select(g => new { Name = g.Key, Count = g.Count() })
                .OrderByDescending(g => g.Count)
                .Take(4)
                .ToListAsync();

            int maxDiseaseCount = diseaseGroups.Any() ? diseaseGroups.Max(d => d.Count) : 1;
            viewModel.TopDiseases = diseaseGroups.Select(d => new DiseaseStatItem
            {
                Name = d.Name ?? "Unknown",
                Count = d.Count,
                Percentage = Math.Round((double)d.Count / maxDiseaseCount * 100, 1)
            }).ToList();

            var insectGroups = await _context.AnalysisResults
                .Where(r => r.DetectedInsectId != null)
                .Include(r => r.DetectedInsect)
                .GroupBy(r => new { r.DetectedInsect!.Name, r.DetectedInsect.Status })
                .Select(g => new { g.Key.Name, g.Key.Status, Count = g.Count() })
                .OrderByDescending(g => g.Count)
                .Take(3)
                .ToListAsync();

            viewModel.TopInsects = insectGroups.Select(i => new InsectStatItem
            {
                Name = i.Name ?? "Unknown",
                Count = i.Count,
                Status = i.Status
            }).ToList();

            var plantGroups = await _context.AnalysisResults
                .Where(r => r.DetectedPlantId != null)
                .Include(r => r.DetectedPlant)
                .GroupBy(r => r.DetectedPlant!.Name)
                .Select(g => new { Name = g.Key, Count = g.Count() })
                .OrderByDescending(g => g.Count)
                .Take(4)
                .ToListAsync();

            int totalPlantAnalyses = plantGroups.Sum(p => p.Count);
            viewModel.TopPlants = plantGroups.Select(p => new PlantStatItem
            {
                Name = p.Name ?? "Unknown",
                Count = p.Count,
                Percentage = totalPlantAnalyses > 0
                    ? Math.Round((double)p.Count / totalPlantAnalyses * 100, 1) : 0
            }).ToList();

            var last7Days = Enumerable.Range(0, 7)
                .Select(i => DateTime.UtcNow.Date.AddDays(-6 + i))
                .ToList();

            viewModel.WeeklyActivity = last7Days.Select(day => new DailyActivityItem
            {
                DayLabel = day.ToString("ddd").ToUpper(),
                Uploads = uploads.Count(u => u.CreatedAt.HasValue && u.CreatedAt.Value.Date == day),
                Users = uploads.Where(u => u.CreatedAt.HasValue && u.CreatedAt.Value.Date == day)
                                .Select(u => u.UserId)
                                .Distinct()
                                .Count()
            }).ToList();

            var recent = await _context.Uploads
                .Where(u => u.IsDeleted != true)
                .Include(u => u.User)
                .Include(u => u.AnalysisResults)
                    .ThenInclude(r => r.DetectedPlant)
                .Include(u => u.AnalysisResults)
                    .ThenInclude(r => r.DetectedDisease)
                .Include(u => u.AnalysisResults)
                    .ThenInclude(r => r.DetectedInsect)
                .OrderByDescending(u => u.CreatedAt)
                .Take(8)
                .ToListAsync();

            viewModel.RecentActivity = recent.Select(u =>
            {
                var result = u.AnalysisResults.FirstOrDefault();
                return new RecentActivityItem
                {
                    UserName = u.User?.Name ?? "Unknown",
                    PlantName = result?.DetectedPlant?.Name,
                    ScientificName = result?.DetectedPlant?.ScientificName,
                    ResultLabel = result?.DetectedInsect?.Name
                        ?? result?.DetectedDisease?.Name
                        ?? "Healthy",
                    IsHealthy = result?.IsDiseased == false,
                    Confidence = result?.ConfidenceScore,
                    Date = u.CreatedAt
                };
            }).ToList();

            return View(viewModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction("Login", "Account", new { area = "" });
        }
    }
}