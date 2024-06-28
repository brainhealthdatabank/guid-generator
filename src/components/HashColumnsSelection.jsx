import React, { useState, useEffect } from 'react';
import { FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';
import { Tile } from './TileStyles';
import ReactMarkdown from 'react-markdown';
import Instruction from './InstructionSelectColumns.md';

const HashColumnsSelection = ({ columns, selectedColumns, handleChange }) => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch(Instruction)
      .then(res => res.text())
      .then(text => setMarkdown(text));
  }, []);


  return (
    <Tile>
      <ReactMarkdown>{markdown}</ReactMarkdown>
      <FormGroup>
        {columns.map(column => (
        <FormControlLabel
            control={<Checkbox checked={selectedColumns.has(column.key)} onChange={handleChange} name={column.key} />}
            label={column.label}
            key={column.key}
        />
        ))}
      </FormGroup>
    </Tile>
  );
};

export default HashColumnsSelection;
