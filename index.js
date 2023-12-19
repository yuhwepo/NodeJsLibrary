import fs from "fs";
import path from "path";
import readline from "readline";
import { stdin as input, stdout as output } from "process";
import chalk from "chalk";

const rl = readline.createInterface({ input, output });

let data = [];

function loadData() {
  const fileContent = fs.readFileSync(path.resolve("./danh-sach.txt"), {
    encoding: "utf-8",
  });
  data = fileContent
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [name, age, title] = line.split(",");
      return { name, age, title };
    });
}

function writeFile() {
  fs.writeFileSync(
    path.resolve("./danh-sach.txt"),
    data
      .map((item) => {
        return `${item.name},${item.age},${item.title}\n`;
      })
      .join(""),
    { encoding: "utf-8" }
  );
}

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function addStudent() {
  const sinhVien = {};

  sinhVien.name = await ask("Nhap ten sinh vien? ");
  sinhVien.age = await ask("Nhap tuoi sinh vien? ");
  sinhVien.title = await ask("Nhap chuc vu sinh vien? ");

  data.push(sinhVien);
  writeFile();
  console.log("=".repeat(100));
  console.log(chalk.green("Da them sinh vien"));
  displayStudents();
  console.log("=".repeat(100));
}

async function editStudent() {
  displayStudents();
  const index = await ask("Nhap so thu tu sinh vien can sua: ");
  const parsedIndex = parseInt(index, 10);
  let isChanged = false;
  if (!isNaN(parsedIndex) && parsedIndex >= 0 && parsedIndex < data.length) {
    const student = data[parsedIndex];
    if ((await ask("Ban co muon sua ten sinh vien? (y/n) ")) === "y") {
      student.name = await ask("Nhap ten moi: ");
      isChanged = true;
    }
    if ((await ask("Ban co muon sua tuoi sinh vien? (y/n) ")) === "y") {
      student.age = await ask("Nhap tuoi moi: ");
      isChanged = true;
    }
    if ((await ask("Ban co muon sua chuc vu sinh vien? (y/n) ")) === "y") {
      student.title = await ask("Nhap chuc vu moi: ");
      isChanged = true;
    }
    data[parsedIndex] = student;
    if (isChanged) {
      writeFile();
      console.log("=".repeat(100));
      console.log(chalk.green("Da sua thong tin sinh vien"));
      console.table(data[parsedIndex]);
      console.log("=".repeat(100));
    } else {
      console.log(chalk.yellow("Khong co thong tin nao duoc thay doi"));
    }
  } else {
    console.log(chalk.red("So thu tu khong hop le"));
  }
}

async function deleteStudent() {
  displayStudents();
  const index = await ask("Nhap so thu tu sinh vien can xoa: ");
  const parsedIndex = parseInt(index, 10);
  if (!isNaN(parsedIndex) && parsedIndex >= 0 && parsedIndex < data.length) {
    data.splice(parsedIndex, 1);
    writeFile();
    console.log(chalk.green("Da xoa sinh vien"));
    displayStudents();
  } else {
    console.log(chalk.red("So thu tu khong hop le"));
  }
}

function displayStudents() {
  console.log("=".repeat(100));
  console.log(chalk.blue("Danh sach sinh vien:"));
  console.table(data);
  console.log("=".repeat(100));
}

async function searchStudent() {
  const name = await ask("Nhap ten sinh vien can tim: ");
  const lowerCaseName = name.toLowerCase();
  const students = data.filter((student) =>
    student.name.toLowerCase().includes(lowerCaseName)
  );
  if (students.length > 0) {
    console.log("=".repeat(100));
    console.log(chalk.blue("Danh sach sinh vien da tim kiem:"));
    console.table(students);
    console.log("=".repeat(100));
  } else {
    console.log(chalk.red("Khong tim thay sinh vien"));
  }
}

(async () => {
  loadData();
  let doContinue = true;
  while (doContinue) {
    const action = await ask(
      `Ban muon lam gi?  
  1. Hien thi danh sach sinh vien
  2. Tim kiem sinh vien
  3. Them sinh vien
  4. Sua sinh vien
  5. Xoa sinh vien
  6. Thoat chuong trinh
Lua chon: `
    );
    switch (action) {
      case "1":
        displayStudents();
        break;
      case "2":
        await searchStudent();
        break;
      case "3":
        await addStudent();
        break;
      case "4":
        await editStudent();
        break;
      case "5":
        await deleteStudent();
        break;
      case "6":
        doContinue = false;
        break;
      default:
        console.log(chalk.red("Lua chon khong hop le"));
    }
  }
  rl.close();
})();
