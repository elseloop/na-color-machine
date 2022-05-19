import {
  Box,
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';

import React from 'react';
import { airtableBase } from '../data/airtable-base';
import { useSnackbar } from 'notistack';

const {
  REACT_APP_AIRTABLE_TABLE_ID
} = process.env;

function chunkArray(bigarray, size = 10) {
  let arrayOfArrays = [];

  for (let i=0; i < bigarray.length; i += size) {
      arrayOfArrays.push(bigarray.slice(i,i+size));
  }

  return arrayOfArrays;
}

const MissedTable = React.memo((props) => {
  const {
    data,
    missed,
    ids,
    numSelected,
    onSelectAllClick,
    rowCount,
    isSelected,
    handleClick,
    selected,
    user,
    resetPage
  } = props;

  const { enqueueSnackbar } = useSnackbar();

  const maybePluralCode = selected.length === 1 ? 'Code' : 'Codes';
  const hasClipboardAPI = navigator.clipboard.writeText;

  const handleAddClick = (event) => {
    event.preventDefault();

    const selectedData = selected.map((item) => {
      const now = new Date();

      return {
        fields: {
          "8CHAR": item.eightId,
          "30CHAR": item.thirtyId,
          "Original": item.original,
          "Editor": `${user.nickname}, ${user.name}`,
          "Date": now.toLocaleDateString()
        }
      };
    });

    const msg = selectedData?.length > 1 ? `${selectedData?.length} new codes added.` : `${selectedData?.length} new code added.`;

    const chunks = chunkArray(selectedData);

    // Airtable API only allows 10 records per create batch.
    // So we need to chunk the array into 10 record batches.
    chunks.map((chunk) => {
      return airtableBase(REACT_APP_AIRTABLE_TABLE_ID).create(
        chunk,
        (err, records) => {
          if (err) {
            console.error(`Error posting to Airtable: ${err}`);
            enqueueSnackbar('Error posting to database. Try again.', {
              autoHideDuration: 7500,
              variant: 'error',
            });

            return;
          }

          if (records && records?.length > 0) {
            // add new records to local cache of database items
            // to save another roundrip to Airtable
            data.push(...records);

            enqueueSnackbar(msg, {
              variant: 'success',
              preventDuplicate: true
            });
          }
        });
    });


  };

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

  const handleCellClick = (index) => {
    const rows = missed.map((miss, idx) => {
      const {eightCharId, thirtyCharId} = ids[idx];

      return [miss, eightCharId, thirtyCharId];
    });

    // grab all cells in column and format into newline-separated string
    let cellValues = rows.map((row) => row[index]);
    let codeString = cellValues.join('\n');

    if (hasClipboardAPI) {
      copy(codeString);
    } else {
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
    <Box className="table--missed">
      <Typography variant="h5" gutterBottom style={{textAlign: 'left', margin: '1rem 0 0'}}>
        {`${missed.length} new color codes`}
      </Typography>
      <Typography variant="overline" display="block" style={{textAlign: 'left', margin: '0 0 1rem'}}>
        Click on any column header to <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }} role="img" aria-label="people with bunny ears partying emoji">👯</span>copy the contents of that column.
      </Typography>
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={onSelectAllClick}
                  inputProps={{ 'aria-label': 'select all entries' }}
                />
              </TableCell>
              <TableCell onClick={() => handleCellClick(0)}>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }} role="img" aria-label="people with bunny ears partying emoji"> 👯 </span>
                Entered value
              </TableCell>
              <TableCell onClick={() => handleCellClick(1)}>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }} role="img" aria-label="people with bunny ears partying emoji"> 👯 </span>
                New 8 Char. Code
              </TableCell>
              <TableCell onClick={() => handleCellClick(2)}>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }} role="img" aria-label="people with bunny ears partying emoji"> 👯 </span>
                New 30 Char. Code
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {missed.map((miss, idx) => {
              const {eightCharId, thirtyCharId} = ids[idx];
              const isItemSelected = isSelected(miss);
              const labelId = `enhanced-table-checkbox-${idx}`;

              return (
                <TableRow
                  hover
                  onClick={(event) => handleClick(event, {
                    original: miss,
                    eightId: eightCharId,
                    thirtyId: thirtyCharId
                  })}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={miss}
                  selected={isItemSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isItemSelected}
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </TableCell>
                  <TableCell>{miss}</TableCell>
                  <TableCell>{eightCharId}</TableCell>
                  <TableCell>{thirtyCharId}</TableCell>
                </TableRow>
              )}
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        size="large"
        color="primary"
        style={{ maxWidth: 'calc(50% - 2rem)', margin: '2rem 1rem 0 0' }}
        type="button"
        disabled={selected.length < 1}
        onClick={handleAddClick}
      >
        <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }} role="img" aria-label="plus sign emoji">＋</span>
        &nbsp;
        {`Add ${selected.length} New ${maybePluralCode}`}
      </Button>

      <Button
        variant="outlined"
        size="large"
        color="default"
        type="button"
        onClick={resetPage}
        style={{ maxWidth: 'calc(50% - 2rem)', margin: '2rem auto 0 1rem' }}
      >
        <span style={{ fontSize: '1.25rem' }} role="img" aria-label="broom emoji"> 🧹 </span>
        &nbsp;
        Reset Page
      </Button>
    </Box>
  )
});

export default MissedTable;
