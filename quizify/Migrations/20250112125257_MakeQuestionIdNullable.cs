using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace quizify.Migrations
{
    /// <inheritdoc />
    public partial class MakeQuestionIdNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ExamQuestions",
                table: "ExamQuestions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Exam",
                table: "Exam");

            migrationBuilder.DropColumn(
                name: "Exam_id",
                table: "ExamQuestions");

            migrationBuilder.RenameTable(
                name: "ExamQuestions",
                newName: "exam_questions");

            migrationBuilder.RenameTable(
                name: "Exam",
                newName: "exams");

            migrationBuilder.RenameColumn(
                name: "username",
                table: "users",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "surname",
                table: "users",
                newName: "Surname");

            migrationBuilder.RenameColumn(
                name: "phone",
                table: "users",
                newName: "Phone");

            migrationBuilder.RenameColumn(
                name: "password",
                table: "users",
                newName: "Password");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "users",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "img",
                table: "users",
                newName: "Img");

            migrationBuilder.RenameColumn(
                name: "gender",
                table: "users",
                newName: "Gender");

            migrationBuilder.RenameColumn(
                name: "email",
                table: "users",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "department",
                table: "users",
                newName: "Department");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "users",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "question_text",
                table: "testquestions",
                newName: "Question_text");

            migrationBuilder.RenameColumn(
                name: "op4",
                table: "testquestions",
                newName: "Op4");

            migrationBuilder.RenameColumn(
                name: "op3",
                table: "testquestions",
                newName: "Op3");

            migrationBuilder.RenameColumn(
                name: "op2",
                table: "testquestions",
                newName: "Op2");

            migrationBuilder.RenameColumn(
                name: "op1",
                table: "testquestions",
                newName: "Op1");

            migrationBuilder.RenameColumn(
                name: "category_id",
                table: "testquestions",
                newName: "Category_id");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "testquestions",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "Question_id",
                table: "exam_questions",
                newName: "ExamId");

            migrationBuilder.RenameColumn(
                name: "Created_at",
                table: "exam_questions",
                newName: "CreatedAt");

            migrationBuilder.AddColumn<string>(
                name: "Answer",
                table: "testquestions",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsApproved",
                table: "testquestions",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Op5",
                table: "testquestions",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Answer",
                table: "questions",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsApproved",
                table: "questions",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "QuestionId",
                table: "exam_questions",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TestQuestionId",
                table: "exam_questions",
                type: "integer",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_exam_questions",
                table: "exam_questions",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_exams",
                table: "exams",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_exams",
                table: "exams");

            migrationBuilder.DropPrimaryKey(
                name: "PK_exam_questions",
                table: "exam_questions");

            migrationBuilder.DropColumn(
                name: "Answer",
                table: "testquestions");

            migrationBuilder.DropColumn(
                name: "IsApproved",
                table: "testquestions");

            migrationBuilder.DropColumn(
                name: "Op5",
                table: "testquestions");

            migrationBuilder.DropColumn(
                name: "Answer",
                table: "questions");

            migrationBuilder.DropColumn(
                name: "IsApproved",
                table: "questions");

            migrationBuilder.DropColumn(
                name: "QuestionId",
                table: "exam_questions");

            migrationBuilder.DropColumn(
                name: "TestQuestionId",
                table: "exam_questions");

            migrationBuilder.RenameTable(
                name: "exams",
                newName: "Exam");

            migrationBuilder.RenameTable(
                name: "exam_questions",
                newName: "ExamQuestions");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "users",
                newName: "username");

            migrationBuilder.RenameColumn(
                name: "Surname",
                table: "users",
                newName: "surname");

            migrationBuilder.RenameColumn(
                name: "Phone",
                table: "users",
                newName: "phone");

            migrationBuilder.RenameColumn(
                name: "Password",
                table: "users",
                newName: "password");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "users",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Img",
                table: "users",
                newName: "img");

            migrationBuilder.RenameColumn(
                name: "Gender",
                table: "users",
                newName: "gender");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "users",
                newName: "email");

            migrationBuilder.RenameColumn(
                name: "Department",
                table: "users",
                newName: "department");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "users",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "Question_text",
                table: "testquestions",
                newName: "question_text");

            migrationBuilder.RenameColumn(
                name: "Op4",
                table: "testquestions",
                newName: "op4");

            migrationBuilder.RenameColumn(
                name: "Op3",
                table: "testquestions",
                newName: "op3");

            migrationBuilder.RenameColumn(
                name: "Op2",
                table: "testquestions",
                newName: "op2");

            migrationBuilder.RenameColumn(
                name: "Op1",
                table: "testquestions",
                newName: "op1");

            migrationBuilder.RenameColumn(
                name: "Category_id",
                table: "testquestions",
                newName: "category_id");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "testquestions",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "ExamId",
                table: "ExamQuestions",
                newName: "Question_id");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "ExamQuestions",
                newName: "Created_at");

            migrationBuilder.AddColumn<int>(
                name: "Exam_id",
                table: "ExamQuestions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Exam",
                table: "Exam",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ExamQuestions",
                table: "ExamQuestions",
                column: "Id");
        }
    }
}
