import fs from "fs";
import path from "path";
import readline from "readline";
import { stdin as input, stdout as output } from "process";
import chalk from "chalk";
import inquirer from "inquirer";

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

async function addStudent() {
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

  data.push(sinhVien);
  writeFile();
  console.log(chalk.green("Da them sinh vien"));
  displayStudents();
}

const updateStudent = (student, answers) => {
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
};

async function editStudent() {
  displayStudents();
  const { index } = await inquirer.prompt([
    {
      type: "input",
      name: "index",
      message: "Nhap so thu tu sinh vien can sua:",
      validate: validateIndex,
    },
  ]);
  const student = data[index];
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
  const isChanged = updateStudent(student, answers);
  data[index] = student;
  if (isChanged) {
    writeFile();
    console.log(chalk.green("Da sua thong tin sinh vien"));
    console.table(data[index]);
  } else {
    console.log(chalk.yellow("Khong co thong tin nao duoc thay doi"));
  }
}

async function deleteStudent() {
  displayStudents();
  const { index } = await inquirer.prompt([
    {
      type: "input",
      name: "index",
      message: "Nhap so thu tu sinh vien can xoa:",
      validate: validateIndex,
    },
  ]);
  data.splice(index, 1);
  writeFile();
  console.log(chalk.green("Da xoa sinh vien"));
  displayStudents();
}

function displayStudents() {
  console.log(chalk.blue("Danh sach sinh vien:"));
  console.table(data);
}

async function searchStudent() {
  const response = await inquirer.prompt([
    { type: "input", name: "name", message: "Nhap ten sinh vien can tim:" },
  ]);
  const lowerCaseName = response.name.toLowerCase();
  const students = data.filter((student) =>
    student.name.toLowerCase().includes(lowerCaseName)
  );
  if (students.length > 0) {
    console.log(chalk.blue("Danh sach sinh vien da tim kiem:"));
    console.table(students);
  } else {
    console.log(chalk.red("Khong tim thay sinh vien"));
  }
}

const validateIndex = (value) => {
  if (value) {
    const parsedValue = Number(value);
    if (Number.isInteger(parsedValue) && parsedValue < data.length) {
      return true;
    }
  }
  return "Vui long nhap so thu tu sinh vien hop le";
};

const validateName = (value) => {
  if (value) {
    return true;
  }
  return "Vui long nhap ten sinh vien";
};

const validateAge = (value) => {
  if (value) {
    const parsedValue = Number(value);
    if (Number.isInteger(parsedValue) && parsedValue > 0) {
      return true;
    }
    return "Vui long nhap so tu nhien lon hon 0";
  }
  return "Vui long nhap tuoi sinh vien";
};

const validateTitle = (value) => {
  if (value) {
    return true;
  }
  return "Vui long nhap chuc vu sinh vien";
};

(async () => {
  loadData();
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
        displayStudents();
        break;
      case "Tim kiem sinh vien":
        await searchStudent();
        break;
      case "Them sinh vien":
        await addStudent();
        break;
      case "Sua sinh vien":
        await editStudent();
        break;
      case "Xoa sinh vien":
        await deleteStudent();
        break;
      case "Thoat chuong trinh":
        doContinue = false;
        break;
      default:
        console.log(chalk.red("Lua chon khong hop le"));
    }
  }
  rl.close();
})();
