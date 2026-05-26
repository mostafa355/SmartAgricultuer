using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using SmartAgricultuer.Services;
using SmartAgricultuer.DTOs;
using System.Security.Claims;

namespace SmartAgricultuer.Controllers
{
    public class BaseController : Controller
    {
        private readonly IHistoryService _historyService;

        public BaseController(IHistoryService historyService)
        {
            _historyService = historyService;
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            // جيب الـ User ID لو مسجل دخول
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null)
            {
                int userId = int.Parse(userIdClaim.Value);
                var scans = _historyService.GetUserHistoryAsync(userId).Result;
                ViewBag.UserScans = scans;
            }

            base.OnActionExecuting(context);
        }

        // دالة تحويل الوقت
        public static string GetTimeAgo(DateTime? dateTime)
        {
            if (dateTime == null) return "";

            var diff = DateTime.UtcNow - dateTime.Value;

            if (diff.TotalSeconds < 60)
                return $"{(int)diff.TotalSeconds}s ago";

            if (diff.TotalMinutes < 60)
                return $"{(int)diff.TotalMinutes}m ago";

            if (diff.TotalHours < 24)
                return $"{(int)diff.TotalHours}h ago";

            if (diff.TotalDays <= 3)
                return $"{(int)diff.TotalDays}d ago";

            // بعد 3 أيام يظهر تاريخ مختصر
            return dateTime.Value.ToString("MMM dd");
        }
    }
}