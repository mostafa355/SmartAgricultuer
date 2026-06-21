using Microsoft.EntityFrameworkCore;

namespace SmartAgricultuer.Models
{
    public partial class AppdbContext
    {
        partial void OnModelCreatingPartial(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Upload>(entity =>
            {
                entity.HasOne(d => d.User)
                    .WithMany()
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_Uploads_AspNetUsers_user_id");
            });
        }
    }
}