import fs from "fs";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer";
import readline from "readline";
import { stdin as input, stdout as output } from "process";
import { Student } from "./student";
import {
  validateIndex,
  validateName,
  validateAge,
  validateTitle,
} from "./validation";

const rl = readline.createInterface({ input, output });

export class StudentManager {
  private data: Student[] = [];

  private loadData() {
    const fileContent = fs.readFileSync(path.resolve("./danh-sach.txt"), {
      encoding: "utf-8",
    });
    this.data = fileContent
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [name, age, title] = line.split(",");
        return { name, age, title };
      });
  }

  private writeFile() {
    fs.writeFileSync(
      path.resolve("./danh-sach.txt"),
      this.data
        .map((item) => {
          return `${item.name},${item.age},${item.title}\n`;
        })
        .join(""),
      { encoding: "utf-8" }
    );
  }

  private async addStudent() {
    const questions = [
      {
        type: "input",
        name: "name",
        message: "Nhap ten sinh vien?",
        validate: validateName,
      },
      {
        type: "input",
        name: "age",
        message: "Nhap tuoi sinh vien?",
        validate: validateAge,
      },
      {
        type: "input",
        name: "title",
        message: "Nhap chuc vu sinh vien?",
        validate: validateTitle,
      },
    ];

    const sinhVien = await inquirer.prompt(questions);

    this.data.push(sinhVien);
    this.writeFile();
    console.log(chalk.green("Da them sinh vien"));
    this.displayStudents();
  }

  private updateStudent(student: Student, answers: any) {
    let isChanged = false;
    if (answers.editName) {
      student.name = answers.name;
      isChanged = true;
    }
    if (answers.editAge) {
      student.age = answers.age;
      isChanged = true;
    }
    if (answers.editTitle) {
      student.title = answers.title;
      isChanged = true;
    }
    return isChanged;
  }

  private async editStudent() {
    this.displayStudents();
    const { index } = await inquirer.prompt([
      {
        type: "input",
        name: "index",
        message: "Nhap so thu tu sinh vien can sua:",
        validate: validateIndex(this.data.length),
      },
    ]);
    const student = this.data[index];
    const questions = [
      {
        type: "confirm",
        name: "editName",
        message: "Ban co muon sua ten sinh vien?",
      },
      {
        type: "input",
        name: "name",
        message: "Nhap ten moi:",
        validate: validateName,
        when: (answers) => answers.editName,
      },
      {
        type: "confirm",
        name: "editAge",
        message: "Ban co muon sua tuoi sinh vien?",
      },
      {
        type: "input",
        name: "age",
        message: "Nhap tuoi moi:",
        validate: validateAge,
        when: (answers) => answers.editAge,
      },
      {
        type: "confirm",
        name: "editTitle",
        message: "Ban co muon sua chuc vu sinh vien?",
      },
      {
        type: "input",
        name: "title",
        message: "Nhap chuc vu moi:",
        validate: validateTitle,
        when: (answers) => answers.editTitle,
      },
    ];
    const answers = await inquirer.prompt(questions);
    const isChanged = this.updateStudent(student, answers);
    this.data[index] = student;
    if (isChanged) {
      this.writeFile();
      console.log(chalk.green("Da sua thong tin sinh vien"));
      console.table(this.data[index]);
    } else {
      console.log(chalk.yellow("Khong co thong tin nao duoc thay doi"));
    }
  }

  private async deleteStudent() {
    this.displayStudents();
    const { index } = await inquirer.prompt([
      {
        type: "input",
        name: "index",
        message: "Nhap so thu tu sinh vien can xoa:",
        validate: validateIndex(this.data.length),
      },
    ]);
    this.data.splice(index, 1);
    this.writeFile();
    console.log(chalk.green("Da xoa sinh vien"));
    this.displayStudents();
  }

  private displayStudents() {
    console.log(chalk.blue("Danh sach sinh vien:"));
    console.table(this.data);
  }

  private async searchStudent() {
    const response = await inquirer.prompt([
      { type: "input", name: "name", message: "Nhap ten sinh vien can tim:" },
    ]);
    const lowerCaseName = response.name.toLowerCase();
    const students = this.data.filter((student) =>
      student.name.toLowerCase().includes(lowerCaseName)
    );
    if (students.length > 0) {
      console.log(chalk.blue("Danh sach sinh vien da tim kiem:"));
      console.table(students);
    } else {
      console.log(chalk.red("Khong tim thay sinh vien"));
    }
  }

  public async run() {
    this.loadData();
    let doContinue = true;
    while (doContinue) {
      const questions = [
        {
          type: "list",
          name: "action",
          message: "Ban muon lam gi?",
          choices: [
            "Hien thi danh sach sinh vien",
            "Tim kiem sinh vien",
            "Them sinh vien",
            "Sua sinh vien",
            "Xoa sinh vien",
            "Thoat chuong trinh",
          ],
        },
      ];
      const { action } = await inquirer.prompt(questions);
      switch (action) {
        case "Hien thi danh sach sinh vien":
          this.displayStudents();
          break;
        case "Tim kiem sinh vien":
          await this.searchStudent();
          break;
        case "Them sinh vien":
          await this.addStudent();
          break;
        case "Sua sinh vien":
          await this.editStudent();
          break;
        case "Xoa sinh vien":
          await this.deleteStudent();
          break;
        case "Thoat chuong trinh":
          doContinue = false;
          break;
        default:
          console.log(chalk.red("Lua chon khong hop le"));
      }
    }
    rl.close();
  }
}
