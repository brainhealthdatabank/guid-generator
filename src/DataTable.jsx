import React, { useState } from 'react';
import { Box, Grid, IconButton, Tabs, Tab, TextField, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { CloudDownload as CloudDownloadIcon } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { computeHashes } from './utils';
import HashColumnsSelection from './components/HashColumnsSelection';
import ParticipantIdColumnSelection from './components/ParticipantIdColumnSelection';
import SheetSelection from './components/SheetSelection';
import DragAndDrop from './components/DragAndDrop';

function DataTable() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [hashedData, setHashedData] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [workbook, setWorkbook] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState(new Set());
  const [participantIdColumn, setParticipantIdColumn] = useState('');


  const handleWorkbookChange = (newWorkbook) => {
    setWorkbook(newWorkbook);
    console.log('Workbook set: ', newWorkbook);
  };


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
      <DragAndDrop handleWorkbookChange={handleWorkbookChange}/>
      {workbook && (
        <SheetSelection
          workbook={workbook}
          setData={setData}
          setColumns={setColumns}
          setParticipantIdColumn={setParticipantIdColumn}
        />
      )}
      {columns.length > 0 && (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <HashColumnsSelection columns={columns} selectedColumns={selectedColumns} handleChange={handleColumnSelectionChange} />
          </Grid>
          <Grid item xs={6}>
            <ParticipantIdColumnSelection columns={columns} participantIdColumn={participantIdColumn} handleChange={handleParticipantIdChange} />
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
