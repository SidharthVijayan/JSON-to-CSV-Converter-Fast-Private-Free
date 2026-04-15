function flattenObject(obj, parentKey = "", result = {}) {
  for (let key in obj) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
      flattenObject(obj[key], newKey, result);
    } else if (Array.isArray(obj[key])) {
      result[newKey] = obj[key].map(item =>
        typeof item === "object" ? JSON.stringify(item) : item
      ).join("; ");
    } else {
      result[newKey] = obj[key];
    }
  }
  return result;
}

function jsonToCsv(input) {
  let jsonData = input;

  // 🔥 Smart detection
  if (!Array.isArray(jsonData)) {
    const possibleArray = Object.values(jsonData).find(v => Array.isArray(v));
    jsonData = possibleArray || [jsonData];
  }

  // 🔥 Flatten all rows
  const flattenedData = jsonData.map(item => flattenObject(item));

  // 🔥 Collect ALL possible headers (important)
  const headersSet = new Set();
  flattenedData.forEach(row => {
    Object.keys(row).forEach(key => headersSet.add(key));
  });

  const headers = Array.from(headersSet);

  const csvRows = [];

  // Header row
  csvRows.push(headers.join(","));

  // Data rows
  for (const row of flattenedData) {
    const values = headers.map(header => {
      let val = row[header] ?? "";
      val = String(val).replace(/"/g, '""');
      return `"${val}"`;
    });

    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
}
