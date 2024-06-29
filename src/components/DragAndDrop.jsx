import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { handleFileRead } from '../utils';
import ReactMarkdown from 'react-markdown';
import Instruction from './InstructionDragAndDrop.md';

const DragAndDrop = ({ handleWorkbookChange }) => {
    
    const [markdown, setMarkdown] = useState('');
    const [fileName, setFileName] = useState('');
    const [workbook, setWorkbook] = useState(null);


    useEffect(() => {
        fetch(Instruction)
            .then(res => res.text())
            .then(text => setMarkdown(text));
    }, []);


    useEffect(() => {
        if (workbook) {
          handleWorkbookChange(workbook);
        }
      }, [workbook, handleWorkbookChange]);


  return (
    <div>
      <ReactMarkdown>{markdown}</ReactMarkdown>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
          handleFileRead(files, setWorkbook, setFileName);
        }}
        style={{ width: '100%', height: '100px', border: '2px dashed #ccc', margin: '20px 0', padding: '10px', textAlign: 'center' }}
      >
        <label style={{ position: 'relative', display: 'block', width: '100%', height: '100%', cursor: 'pointer' }}>
          Drag and drop an Excel file here or click to select.
          <input
            type="file"
            onChange={(e) => handleFileRead(e.target.files, setWorkbook, setFileName)}
            style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, opacity: 0, cursor: 'pointer' }}
            accept=".xlsx,.xls"
          />
          {fileName && <p>{fileName}</p>}
        </label>
      </div>
    </div>
  );
};

DragAndDrop.propTypes = {
    handleWorkbookChange: PropTypes.func.isRequired,
  };

export default DragAndDrop;
