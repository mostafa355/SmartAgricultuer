using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartAgricultuer.Migrations
{
    /// <inheritdoc />
    public partial class AddProfileImageOnly : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // هنا بنقول للـ EF يضيف عمود الصورة فقط جوه جدول المستخدمين الحالي
            migrationBuilder.AddColumn<string>(
                name: "ProfilePicture",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // في حالة حبيت ترجع في كلامك، يمسح العمود ده بس
            migrationBuilder.DropColumn(
                name: "ProfilePicture",
                table: "AspNetUsers");
        }
    }
}