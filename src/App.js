import React, { useState } from 'react';
import Introduction from './components/Introduction';
import DataTable from './components/DataTable';
import { CssBaseline, Container } from '@mui/material';
import { computeHashes } from './utils';
import HashColumnsSelection from './components/HashColumnsSelection';
import ParticipantIdColumnSelection from './components/ParticipantIdColumnSelection';
import SheetSelection from './components/SheetSelection';
import DragAndDrop from './components/DragAndDrop';

function App() {
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
    <div className="App">
      <CssBaseline />
      <Container maxWidth="lg">
        <Introduction />
        <DragAndDrop handleWorkbookChange={handleWorkbookChange} />
        {workbook && (
          <SheetSelection
            workbook={workbook}
            setData={setData}
            setColumns={setColumns}
            setParticipantIdColumn={setParticipantIdColumn}
          />
        )}
        {columns.length > 0 && (
          <>
            <HashColumnsSelection
              columns={columns}
              selectedColumns={selectedColumns}
              handleChange={handleColumnSelectionChange}
            />
            <ParticipantIdColumnSelection
              columns={columns}
              participantIdColumn={participantIdColumn}
              handleChange={handleParticipantIdChange}
            />
          </>
        )}
        <DataTable
          data={gridData}
          columns={dataGridColumns}
          tabValue={tabValue}
          onTabChange={handleTabChange}
          computeHashes={() => computeHashes(data, selectedColumns, participantIdColumn, setHashedData)}
        />
      </Container>
    </div>
  );
}

export default App;
