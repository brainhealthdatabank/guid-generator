import React, { useState, useEffect } from 'react';
import { FormGroup, FormControlLabel, Radio, Typography, RadioGroup } from '@mui/material';
import { Tile } from './TileStyles';
import ReactMarkdown from 'react-markdown';
import Instruction from './InstructionSelectParticipantId.md';

const ParticipantIdColumnSelection = ({ columns, participantIdColumn, handleChange }) => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch(Instruction)
      .then(res => res.text())
      .then(text => setMarkdown(text));
  }, []);

  return (
    <Tile>
      <ReactMarkdown>{markdown}</ReactMarkdown>
      <RadioGroup value={participantIdColumn} onChange={handleChange}>
        {columns.map(column => (
          <FormControlLabel value={column.key} control={<Radio />} label={column.label} key={column.key} />
        ))}
      </RadioGroup>
    </Tile>
  );
};

export default ParticipantIdColumnSelection;
