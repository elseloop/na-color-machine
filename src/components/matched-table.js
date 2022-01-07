import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Typography
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

const MatchedTable = ({ matches }) => {
  const { enqueueSnackbar } = useSnackbar();
  const hasClipboardAPI = navigator.clipboard.writeText;

  async function copy(content) {
    try {
      await navigator.clipboard.writeText(content);
      enqueueSnackbar('Column successfully copied!', { variant: 'success' });
      return true;
    }
    catch (error) {
      console.log('copy error', error);
    }
  }

  const handleCellClick = (idx) => {
    // grab all cells in column and format into newline-separated string
    let cellValues = matches.map((match) => match.fields[idx]);
    let codeString = cellValues.join('\n');

    // copy string to clipboard
    if (hasClipboardAPI) {
      // if Clipboard API is available, use it
      copy(codeString);
    } else {
      // otherwise, use execCommand()
      let tf = document.createElement('textarea');
      tf.innerHTML = codeString;
      document.body.appendChild(tf);
      tf.select();

      document.execCommand("copy");
      document.body.removeChild(tf);

      enqueueSnackbar('Column successfully copied!', { variant: 'success' });
    }

    return codeString;
  }

  return (
    <Box className="table--matched">
      <Typography variant="h5" gutterBottom style={{textAlign: 'left', margin: '1rem 0 0'}}>
        {`${matches.length} existing color codes`}
      </Typography>
      <Typography variant="overline" display="block" style={{textAlign: 'left', margin: '0 0 1rem'}}>
        Click on any column header to <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }} role="img" aria-label="people with bunny ears partying emoji">👯</span>copy the contents of that column.
      </Typography>
      <TableContainer component={Paper}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleCellClick('Original')}>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }} role="img" aria-label="people with bunny ears partying emoji"> 👯 </span>
                Original
              </TableCell>
              <TableCell onClick={() => handleCellClick('8CHAR')}>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }} role="img" aria-label="people with bunny ears partying emoji"> 👯 </span>
                8 Char. Code
              </TableCell>
              <TableCell onClick={() => handleCellClick('30CHAR')}>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }} role="img" aria-label="people with bunny ears partying emoji"> 👯 </span>
                30 Char. Code
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matches.map((match, idx) => (
              <TableRow key={`${match.fields['8CHAR']}-${idx}`}>
                <TableCell>{match.fields['Original'].trim().toLowerCase()}</TableCell>
                <TableCell>{match.fields['8CHAR']}</TableCell>
                <TableCell>{match.fields['30CHAR']}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
};

export default MatchedTable;
