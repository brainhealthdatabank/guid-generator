import React, { useState, useEffect } from 'react';
import { Tile } from './TileStyles';
import { Box, TextField, Button } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { handleSheetLoad } from '../utils';
import Instruction from './InstructionSelectSheet.md';

const SheetSelection = ({ workbook, setData, setColumns, setParticipantIdColumn }) => {

    const [markdown, setMarkdown] = useState('');
    const [sheetName, setSheetName] = useState('');
    const [headerRow, setHeaderRow] = useState(1);

    useEffect(() => {
        fetch(Instruction)
            .then(res => res.text())
            .then(text => setMarkdown(text));
    }, []);

    return (
        <div>
            <ReactMarkdown>{markdown}</ReactMarkdown>
            <Tile>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
                    <TextField
                        label="Sheet Name"
                        variant="outlined"
                        onChange={(e) => setSheetName(e.target.value)}
                    />
                    <TextField
                        label="Header Row"
                        variant="outlined"
                        type="number"
                        onChange={(e) => setHeaderRow(parseInt(e.target.value, 10))}
                    />
                    <Button
                        size="small"
                        variant="contained"
                        onClick={() => {
                            if (workbook) {
                                handleSheetLoad(workbook, sheetName, headerRow, setData, setColumns, setParticipantIdColumn);
                            } else {
                                console.error('No file loaded or invalid file!');
                            }
                        }}
                        style={{ alignSelf: 'flex-start' }}
                    >
                        Load Sheet
                    </Button>
                </Box>
            </Tile>
        </div>
    );
};

export default SheetSelection;
