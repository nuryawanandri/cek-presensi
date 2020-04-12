async function onClickSubmit() {
  const inputFile = document.getElementById("inputFile").files;
  const inputFileClass = document.getElementById("inputFileClass").files;
  const generateBtnElem = document.getElementById("btn-generate");
  const tableElem = document.getElementById("late-student-data");
  const selectedColumnClassElem = document.getElementById(
    "selected-column-class"
  );
  const selectedColumnPresentElem = document.getElementById(
    "selected-column-presensi"
  );
  const noDataElem = document.getElementById("no-data-box");

  const selectedColumnClass = selectedColumnClassElem.value - 1 || 0;
  const selectedColumnPresent = selectedColumnPresentElem.value - 1 || 0;

  const absensiData = await readFile(inputFile[0]);
  const classData = await readFile(inputFileClass[0]);

  refreshTable();

  const lateStudentsData = [];

  classData.forEach(data => {
    const dataName = formatName(data.split(/,/)[selectedColumnClass]);
    let dataFound = 0;
    absensiData.forEach(absensi => {
      const dataAbsensiName = absensi.split(/,/)[selectedColumnPresent];
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

  if (lateStudentsData.length > 0) {
    generateBtnElem.style.display = "block";
    generateBtnElem.onclick = () => generateToCsv(lateStudentsData);
    noDataElem.style.display = "none";
  } else {
    generateBtnElem.style.display = "none";
    noDataElem.style.display = "flex";
  }

  tableElem.style.display = "table";

  renderTable(lateStudentsData);
}

function readFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = function(e) {
      resolve(e.target.result.split(/\n/));
    };
    reader.readAsText(file);
  });
}

function renderTable(data) {
  const tableElem = document.getElementById("late-student-data");

  data.shift();

  data.forEach((dataAbsen, index) => {
    const columnElem = document.createElement("tr");

    const rowNumber = document.createElement("td");
    const rowName = document.createElement("td");
    const rowClass = document.createElement("td");
    const rowNoTes = document.createElement("td");

    const splitedData = dataAbsen.split(/,/);

    rowNumber.append(index + 1);
    rowName.append(splitedData[1]);
    rowClass.append(splitedData[2]);
    rowNoTes.append(splitedData[3]);

    columnElem.append(rowNumber);
    columnElem.append(rowName);
    columnElem.append(rowClass);
    columnElem.append(rowNoTes);

    tableElem.appendChild(columnElem);
  });
}

function formatName(name) {
  let nameInput = name.toString();
  nameInput = nameInput.replace(/\"/g, "");
  if (nameInput.charAt(0) === "0") {
    nameInput = nameInput.substr(1);
  }
  return nameInput
    .toLowerCase()
    .replace(/ /g, "")
    .replace(/'/g, "")
    .replace(/-/g, "")
    .replace(/\r/g, "")
    .replace(/\n/g, "");
}

function refreshTable() {
  const tableElem = document.getElementById("late-student-data");
  const columnElem = document.createElement("tr");
  const rowNumber = document.createElement("th");
  const rowName = document.createElement("th");
  const rowClass = document.createElement("th");
  const rowNoTes = document.createElement("th");

  tableElem.innerHTML = "";

  rowNumber.append("No");
  rowName.append("Name");
  rowClass.append("Class");
  rowNoTes.append("Nomor Daring");

  columnElem.append(rowNumber);
  columnElem.append(rowName);
  columnElem.append(rowClass);
  columnElem.append(rowNoTes);
  columnElem.className = "rows-table-header";

  tableElem.appendChild(columnElem);
}

function generateToCsv(data) {
  const fileName = prompt("Masukan nama file CSV yang akan disimpan : ");

  let csvContent = "data:text/csv;charset=utf-8,";

  data.unshift("No, No Presensi, Nama, Kelas, Nomor Daring");
  data.forEach(function(dataRow, index) {
    let row = dataRow;
    if (index > 0) {
      row = `${index}, ${row}`;
    }

    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${fileName}.csv`);
  document.body.appendChild(link);

  link.click();
}

function generatePreviewTable(idContainer, data) {
  const containerTable = document.getElementById(idContainer);
  const tableElemn = document.createElement("table");
  const selectedColumnClassElem = document.getElementById(
    "selected-column-class"
  );

  tableElemn.className = "table-data show-table table-preview";
  for (let index = 0; index < 5; index++) {
    const trElem = document.createElement("tr");
    data[index].split(/,/).forEach(value => {
      const tdElem = document.createElement("td");
      tdElem.onmouseenter = onMouseEnterTable(tdElem);
      tdElem.onmouseleave = onMouseLeaveTable(tdElem);
      tdElem.append(value);
      trElem.append(tdElem);
    });
    tableElemn.append(trElem);
  }
  containerTable.append(tableElemn);
}

async function onSelectData(idContainer, idInput) {
  const inputFile = document.getElementById(idInput).files;
  const data = await readFile(inputFile[0]);
  generatePreviewTable(idContainer, data);
}

function onMouseEnterTable(elem) {
  return () => {
    elem.className += " on-hover-column";
  };
}

function onMouseLeaveTable(elem) {
  return () => {
    console.log("here");
    elem.className = elem.className.replace(" on-hover-column", "");
  };
}
