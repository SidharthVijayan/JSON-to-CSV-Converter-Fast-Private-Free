const jsonInput = document.getElementById("jsonInput");
const convertBtn = document.getElementById("convertBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const tableContainer = document.getElementById("tableContainer");
const columnsDiv = document.getElementById("columns");
const errorEl = document.getElementById("error");

let currentData = [];
let selectedColumns = [];

convertBtn.onclick = () => {
  try {
    errorEl.textContent = "";
    const parsed = JSON.parse(jsonInput.value);

    const flat = prepareData(parsed);
    currentData = flat;

    renderColumns(flat);
    renderTable(flat);

    copyBtn.disabled = false;
    downloadBtn.disabled = false;

  } catch (e) {
    errorEl.textContent = "Invalid JSON";
  }
};

function prepareData(input) {
  let data = input;

  if (!Array.isArray(data)) {
    const arr = Object.values(data).find(v => Array.isArray(v));
    data = arr || [data];
  }

  return data.map(item => flattenObject(item));
}

function renderColumns(data) {
  columnsDiv.innerHTML = "";
  const keys = Object.keys(data[0]);
  selectedColumns = [...keys];

  keys.forEach(key => {
    const tag = document.createElement("div");
    tag.textContent = key;
    tag.className = "column-tag active";

    tag.onclick = () => {
      tag.classList.toggle("active");
      selectedColumns = Array.from(
        document.querySelectorAll(".column-tag.active")
      ).map(el => el.textContent);

      renderTable(currentData);
    };

    columnsDiv.appendChild(tag);
  });
}

function renderTable(data) {
  let html = "<table><tr>";

  selectedColumns.forEach(col => {
    html += `<th>${col}</th>`;
  });

  html += "</tr>";

  data.forEach(row => {
    html += "<tr>";
    selectedColumns.forEach(col => {
      html += `<td>${row[col] ?? ""}</td>`;
    });
    html += "</tr>";
  });

  html += "</table>";
  tableContainer.innerHTML = html;
}

function generateCsv() {
  const rows = [];

  rows.push(selectedColumns.join(","));

  currentData.forEach(row => {
    const values = selectedColumns.map(col => {
      let val = row[col] ?? "";
      val = String(val).replace(/"/g, '""');
      return `"${val}"`;
    });
    rows.push(values.join(","));
  });

  return rows.join("\n");
}

copyBtn.onclick = () => {
  navigator.clipboard.writeText(generateCsv());
};

downloadBtn.onclick = () => {
  const blob = new Blob([generateCsv()], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "data.csv";
  a.click();
};
