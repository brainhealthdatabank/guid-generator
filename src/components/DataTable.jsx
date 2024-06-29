import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Tabs, Tab, Button, IconButton } from '@mui/material';
import { CloudDownload as CloudDownloadIcon } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ReactMarkdown from 'react-markdown';
import Instruction from './InstructionComputeHash.md';


const DataTable = ({ data, columns, tabValue, onTabChange, computeHashes }) => {

  const [markdown, setMarkdown] = useState('');


  useEffect(() => {
    fetch(Instruction)
        .then(res => res.text())
        .then(text => setMarkdown(text));
}, []);


  const downloadExcel = () => {
    const processedData = data.map(row => {
      const newRow = {};
      Object.keys(row).forEach(key => {
        newRow[key] = '\t' + row[key].toString();
      });
      return newRow;
    });

    const ws = XLSX.utils.json_to_sheet(processedData, {
      header: Object.keys(data[0]),
      skipHeader: false
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    const s2ab = s => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
      }
      return buf;
    };

    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'data.xlsx');
  };

  return (
    <div>
      <ReactMarkdown>{markdown}</ReactMarkdown>
      <Box sx={{ width: '100%', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tabs value={tabValue} onChange={onTabChange} aria-label="Data Tabs">
          <Tab label="Original Data" />
          <Tab label="Hashed Data" />
        </Tabs>
        <Box>
          <Button size="small" variant="contained" onClick={computeHashes} style={{ marginRight: '10px' }}>Compute Hashes</Button>
          {tabValue === 1 && (
            <IconButton onClick={downloadExcel} color="primary" aria-label="download excel">
              <CloudDownloadIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={data.map((row, index) => ({ ...row, id: index }))}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </div>
    </div>
  );
};

export default DataTable;
