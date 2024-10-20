using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class FixForKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Eventos_Usuarios_ProprietarioId",
                table: "Eventos");

            migrationBuilder.DropForeignKey(
                name: "FK_Inscricoes_Eventos_EventoId",
                table: "Inscricoes");

            migrationBuilder.DropForeignKey(
                name: "FK_Inscricoes_Usuarios_UsuarioId",
                table: "Inscricoes");

            migrationBuilder.AlterColumn<int>(
                name: "UsuarioId",
                table: "Inscricoes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "EventoId",
                table: "Inscricoes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ProprietarioId",
                table: "Eventos",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Eventos_Usuarios_ProprietarioId",
                table: "Eventos",
                column: "ProprietarioId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Inscricoes_Eventos_EventoId",
                table: "Inscricoes",
                column: "EventoId",
                principalTable: "Eventos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Inscricoes_Usuarios_UsuarioId",
                table: "Inscricoes",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Eventos_Usuarios_ProprietarioId",
                table: "Eventos");

            migrationBuilder.DropForeignKey(
                name: "FK_Inscricoes_Eventos_EventoId",
                table: "Inscricoes");

            migrationBuilder.DropForeignKey(
                name: "FK_Inscricoes_Usuarios_UsuarioId",
                table: "Inscricoes");

            migrationBuilder.AlterColumn<int>(
                name: "UsuarioId",
                table: "Inscricoes",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AlterColumn<int>(
                name: "EventoId",
                table: "Inscricoes",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AlterColumn<int>(
                name: "ProprietarioId",
                table: "Eventos",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddForeignKey(
                name: "FK_Eventos_Usuarios_ProprietarioId",
                table: "Eventos",
                column: "ProprietarioId",
                principalTable: "Usuarios",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Inscricoes_Eventos_EventoId",
                table: "Inscricoes",
                column: "EventoId",
                principalTable: "Eventos",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Inscricoes_Usuarios_UsuarioId",
                table: "Inscricoes",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id");
        }
    }
}
