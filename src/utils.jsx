import * as XLSX from 'xlsx';
import CryptoJS from 'crypto-js';


export const handleFileRead = (files, handleWorkbookChange, setFileName) => {
  if (files.length > 0) {
    const file = files[0];
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const binaryStr = loadEvent.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      handleWorkbookChange(workbook);
    };
    reader.readAsBinaryString(file);
  } else {
    console.error('No file loaded');
  }
};

export const handleSheetLoad = (workbook, sheetName, headerRow, setData, setColumns, setParticipantIdColumn) => {
  if (!workbook) {
    alert('No file loaded or invalid file!');
    return;
  }
  if (!workbook.Sheets[sheetName]) {
    alert('Sheet not found in the loaded workbook!');
    return;
  }
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  if (jsonData && Array.isArray(jsonData) && jsonData.length >= headerRow) {
    const headers = jsonData[headerRow - 1].map((header, index) => ({
      label: header.toString(),
      key: `col${index + 1}`
    }));
    setColumns(headers);
    setParticipantIdColumn(headers[0].key); // Default to the first column if available

    const newData = jsonData.slice(headerRow).map(row => {
      let rowData = {};
      row.forEach((cell, index) => {
        rowData[headers[index] ? headers[index].key : `col${index + 1}`] = cell;
      });
      return rowData;
    });
    setData(newData);
  } else {
    alert('Header row is out of range or the data is not as expected!');
  }
};

export const computeHashes = (data, selectedColumns, participantIdColumn, setHashedData) => {
  const newData = data.map(row => {

    // Sort the selected column names alphabetically
    const sortedSelectedColumns = Array.from(selectedColumns).sort();

    // create rowData by iterating over sorted selected column names
    const rowData = sortedSelectedColumns
      .map(key => String(row[key]).trim())
      .join('');

    const hash = CryptoJS.SHA256(rowData).toString(CryptoJS.enc.Hex);

    // Prepare the new row for the "Hashed Data" tab
    let newRow = {
      participant_id: String(row[participantIdColumn]).trim(),
      hash
    };

    // Include all other columns not selected for hashing
    Object.keys(row).forEach(key => {
      if (!selectedColumns.has(key) && key !== participantIdColumn) {
        newRow[key] = String(row[key]).trim();
      }
    });

    return newRow;
    
  });

  // Update the state or perform further operations with the new hashed data
  setHashedData(newData);
};
