function jsonToCsv(jsonData) {
  if (!Array.isArray(jsonData)) {
    throw new Error("JSON must be an array of objects");
  }

  const headers = Object.keys(jsonData[0]);

  const csvRows = [];

  // Header row
  csvRows.push(headers.join(","));

  // Data rows
  for (const row of jsonData) {
    const values = headers.map(header => {
      let val = row[header] ?? "";
      val = String(val).replace(/"/g, '""');
      return `"${val}"`;
    });

    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
}
