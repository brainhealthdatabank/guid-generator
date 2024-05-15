import React, { useState } from 'react';
import { Box, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tab, TextField, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { CloudDownload as CloudDownloadIcon } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { computeHashes, handleFileRead, handleSheetLoad } from './utils';
import HashColumnsSelection from './components/HashColumnsSelection';
//import ColumnSelection from './ColumnSelection';
import ParticipantIdColumnSelection from './components/ParticipantIdColumnSelection';

function DataTable() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [hashedData, setHashedData] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [workbook, setWorkbook] = useState(null);
  const [sheetName, setSheetName] = useState('');
  const [headerRow, setHeaderRow] = useState(1);
  const [selectedColumns, setSelectedColumns] = useState(new Set());
  const [participantIdColumn, setParticipantIdColumn] = useState('');
  const [fileName, setFileName] = useState('');

  const handleColumnSelectionChange = (event) => {
    const columnKey = event.target.name;
    setSelectedColumns(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(columnKey)) {
        newSelected.delete(columnKey);
      } else {
        newSelected.add(columnKey);
      }
      return newSelected;
    });
  };

  const handleParticipantIdChange = (event) => {
    setParticipantIdColumn(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const downloadExcel = () => {
    // Preprocess the data: Convert every entry to string and prepend with '\t' to force Excel to interpret it as text
    const processedData = hashedData.map(row => {
      const newRow = {};
      Object.keys(row).forEach(key => {
        newRow[key] = '\t' + row[key].toString();  // Prepend with a tab character to ensure Excel treats it as text
      });
      return newRow;
    });
  
    // Create a worksheet from the processed data
    const ws = XLSX.utils.json_to_sheet(processedData, {
      header: Object.keys(hashedData[0]),  // Assume hashedData is non-empty for headers
      skipHeader: false  // Use the headers from the processed data instead
    });
  
    // Optionally set the cell types explicitly if needed (uncomment to use)
    // Object.keys(ws).forEach(cell => {
    //   if (cell[0] !== '!') ws[cell].t = 's';  // Set cell type to string
    // });
  
    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hashed Data');
  
    // Convert the workbook to a binary array
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    const s2ab = s => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
      };
      return buf;
    };
  
    // Save the workbook as a downloadable file
    saveAs(new Blob([s2ab(wbout)], {type: "application/octet-stream"}), 'hashed_data.xlsx');
  };
  
  

  // Prepare columns for DataGrid based on the selected tab
  const dataGridColumns = tabValue === 0 ? 
    columns.map(c => ({ field: c.key, headerName: c.label, width: 150 })) :
    [
      { field: 'participant_id', headerName: 'Participant ID', width: 150 },
      { field: 'hash', headerName: 'Hash', width: 150 },
      ...columns.filter(c => !selectedColumns.has(c.key) && c.key !== participantIdColumn).map(c => ({ field: c.key, headerName: c.label, width: 150 }))
    ];

  const gridData = tabValue === 0 ? data : hashedData;

  return (
    <div>
      <div>
        Step 1: Drag and drop as Excel file here.
      </div>
      <div onDragOver={(e) => e.preventDefault()} onDrop={e => handleFileRead(e, setWorkbook, setFileName)} style={{ width: '100%', height: '100px', border: '2px dashed #ccc', margin: '20px 0', padding: '10px', textAlign: 'center' }}>
        Drag and drop an Excel file here
        {fileName && <p>Loaded File: {fileName}</p>}
      </div>
      <div>
        Step 2: Select the sheet that contains the participant information and the consent information.
        )
      </div>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
        <TextField label="Sheet Name" variant="outlined" value={sheetName} onChange={(e) => setSheetName(e.target.value)} />
        <TextField label="Header Row" variant="outlined" type="number" value={headerRow} onChange={(e) => setHeaderRow(parseInt(e.target.value, 10))} />
        <Button size="small" variant="contained" onClick={() => handleSheetLoad(workbook, sheetName, headerRow, setData, setColumns, setParticipantIdColumn)} style={{ alignSelf: 'flex-start' }}>Load Sheet</Button>
      </Box>
      {columns.length > 0 && (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <HashColumnsSelection title="Step 3: Select Columns for Hash Calculation" columns={columns} selectedColumns={selectedColumns} handleChange={handleColumnSelectionChange} />
          </Grid>
          <Grid item xs={6}>
            <ParticipantIdColumnSelection title="Step 4; Select Participant ID Column" columns={columns} participantIdColumn={participantIdColumn} handleChange={handleParticipantIdChange} />
          </Grid>
        </Grid>
      )}
      <Box sx={{ width: '100%', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="Data Tabs">
          <Tab label="Original Data" />
          <Tab label="Hashed Data" />
        </Tabs>
        <Box>
          <Button size="small" variant="contained" onClick={() => computeHashes(data, selectedColumns, participantIdColumn, setHashedData)} style={{ marginRight: '10px' }}>Compute Hashes</Button>
          {tabValue === 1 && (
            <IconButton onClick={downloadExcel} color="primary" aria-label="download excel">
              <CloudDownloadIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={gridData.map((row, index) => ({ ...row, id: index }))}
          columns={dataGridColumns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </div>
      <div></div>
    </div>
  );
}

export default DataTable;
