const jsonInput = document.getElementById("jsonInput");
const csvOutput = document.getElementById("csvOutput");
const convertBtn = document.getElementById("convertBtn");
const downloadBtn = document.getElementById("downloadBtn");
const errorEl = document.getElementById("error");

let currentCsv = "";

convertBtn.addEventListener("click", () => {
  errorEl.textContent = "";
  csvOutput.value = "";
  downloadBtn.disabled = true;

  try {
    const parsed = JSON.parse(jsonInput.value);
    const csv = jsonToCsv(parsed);

    csvOutput.value = csv;
    currentCsv = csv;

    downloadBtn.disabled = false;
  } catch (err) {
    errorEl.textContent = err.message;
  }
});

downloadBtn.addEventListener("click", () => {
  const blob = new Blob([currentCsv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "converted.csv";
  a.click();

  URL.revokeObjectURL(url);
});
