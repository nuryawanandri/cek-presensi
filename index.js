async function onClickSubmit() {
  const inputFile = document.getElementById("inputFile").files;
  const inputFileClass = document.getElementById("inputFileClass").files;

  const absensiData = await readFile(inputFile[0]);
  const classData = await readFile(inputFileClass[0]);

  refreshTable();

  const lateStudentsData = [];

  classData.forEach((data) => {
    const dataName = formatName(data.split(/,/)[0]);
    let dataFound = 0;
    absensiData.forEach((absensi) => {
      const dataAbsensiName = absensi.split(/,/)[4];
      if (dataAbsensiName) {
        if (formatName(dataAbsensiName) === dataName) {
          dataFound++;
        }
      }
    });
    if (dataFound === 0) {
      lateStudentsData.push(data);
    }
  });

  generateToCsv(lateStudentsData);

  renderTable(lateStudentsData);
}

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      resolve(e.target.result.split(/\n/));
    };
    reader.readAsText(file);
  });
}

function renderTable(data) {
  const tableElem = document.getElementById("late-student-data");

  data.forEach((dataAbsen, index) => {
    const columnElem = document.createElement("tr");

    const rowNumber = document.createElement("td");
    const rowName = document.createElement("td");
    const rowClass = document.createElement("td");

    const splitedData = dataAbsen.split(/,/);

    rowNumber.append(index + 1);
    rowName.append(splitedData[0]);
    rowClass.append(splitedData[1]);

    columnElem.append(rowNumber);
    columnElem.append(rowName);
    columnElem.append(rowClass);

    tableElem.appendChild(columnElem);
  });
}

function formatName(name) {
  return name
    .toLowerCase()
    .replace(/ /g, "")
    .replace(/'/g, "")
    .replace(/-/g, "");
}

function refreshTable() {
  const tableElem = document.getElementById("late-student-data");
  const columnElem = document.createElement("tr");
  const rowNumber = document.createElement("th");
  const rowName = document.createElement("th");
  const rowClass = document.createElement("th");

  tableElem.innerHTML = "";

  rowNumber.append("No");
  rowName.append("Name");
  rowClass.append("Class");

  columnElem.append(rowNumber);
  columnElem.append(rowName);
  columnElem.append(rowClass);

  tableElem.appendChild(columnElem);
}

function generateToCsv(data) {
  let csvContent = "data:text/csv;charset=utf-8,";

  data.unshift("No, Nama, Kelas");
  data.forEach(function (dataRow, index) {
    let row = dataRow;
    if (index > 0) {
      row = `${index}, ${row}`;
    }

    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "dafterHadir.csv");
  document.body.appendChild(link);

  link.click();
}
