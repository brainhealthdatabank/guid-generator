import React from 'react';
import Introduction from './components/Introduction';
import DataTable from './DataTable';
import { CssBaseline, Container, Typography } from '@mui/material';

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <Container maxWidth="lg">
        <Introduction />
        <DataTable />
      </Container>
    </div>
  );
}

export default App;
