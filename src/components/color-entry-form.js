import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  TextareaAutosize,
  Typography
} from '@material-ui/core';
import MatchedTable from './matched-table';
import MissedTable from './missed-table';

const ColorEntryForm = ({ data, user}) => {
  const [textInput, setTextInput] = useState('');
  const [matched, setMatched] = useState([]);
  const [misses, setMisses] = useState([]);
  const [newIds, setNewIds] = useState([]);
  const [selected, setSelected] = useState([]);
  const [formHidden, setFormHidden] = useState(false);
  const codeForm = useRef(null);

  const haveResults = matched.length >= 1 || misses.length >= 1;

  const boxStyles = {
    borderBottom: '2rem',
    height: '100%',
    position: 'relative',
    width: '100%',
  };

  const btnStyles = {
    margin: '2rem 1rem 0 0',
    maxWidth: '50%',
  };

  const hiddenBoxStyles = {
    marginBottom: '2rem',
    maxHeight: '75vh',
    opacity: '1',
    overflow: 'hidden',
    transition: 'max-height 0.33s ease-in-out, opacity 0.33s ease-in-out',
    width: '100%',
  };

  const hideBtnStyles = {
    bottom: '3rem',
    opacity: haveResults ? '1' : '0',
    pointerEvents: haveResults ? 'auto' : 'none',
    position: 'absolute',
    right: '0',
    transition: 'opacity 0.33s ease-in-out',
    whiteSpace: 'nowrap',
    width: 'auto',
  };

  const eightChars = data.map((x) => x.fields['8CHAR']);

  // creates random ID of {size} length
  const generateID = function(size) {
    // using only lowercase,
    // as they're easier to read
    // removed numbers that look like letters
    // removed `cfhistu` to avoid possible swears, etc, just in case
    const alphabet = '23456789abdegjkmnpqrvwxyz';
    let rando = '';

    for (let i = 0; i < size; i++) {
      rando += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    return rando;
  }

  // tests generated ID against existing IDs to ensure it's unique
  // @param existingIds, array, set of existing IDs
  // @param numAttempts, int, how many tries for unique before we bail
  // @param size, int, length of resulting ID
  const generateUnique = function(existingIds, numAttempts = 9999, size) {
    existingIds = existingIds || [];
    let retries = 0;
    let id;

    while(!id && retries < numAttempts) {
      id = generateID(size);

      if(existingIds.indexOf(id) !== -1) {
        id = null;
        retries++;
      }
    }

    return id;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();

    const clean = (str) => str.trim().toLowerCase();

    // split on line breaks & filter duplicates
    const valArr = textInput.split(/\r?\n/);
    const cleanedArray = valArr.map((x) => clean(x)).filter(Boolean);
    const cleanValuesArray = [...new Set(cleanedArray)];

    const findDataMatch = () => {
      return cleanValuesArray.map((value) => {
        return data.find( ({fields}) => {
          return clean(fields.Original) === clean(value);
        });
      }).filter( Boolean );
    };

    const findMisses = () => {
      const found = findDataMatch();
      const foundVals = found.map((f) => f.fields.Original);

      const notFound = cleanValuesArray.filter((value) => {
        return !foundVals.includes(clean(value));
      }).map((v) => clean(v));

      return notFound;
    };

    const matchesArray = findDataMatch();
    const missesArray = findMisses();

    setMatched(matchesArray);
    setMisses(missesArray);

    const makeIds = () => {
      const missedArr = findMisses();

      return missedArr.map((item) => {
        const eightCharId = generateUnique(eightChars, 9999, 8);
        const thirtyCharId = item.slice(0, 30);

        return {
          eightCharId,
          thirtyCharId
        }
      });
    }

    setNewIds(makeIds);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = misses.map((miss, idx) => {
        return {
          original: miss,
          eightId: newIds[idx].eightCharId,
          thirtyId: newIds[idx].thirtyCharId
        }
      });

      setSelected(newSelecteds);

      return;
    }

    setSelected([]);
  };

  const findSelected = (name) => {
    const selectedItem = selected.find(({original}) => original === name);
    const selectedIndex = selected.indexOf(selectedItem);

    return selectedIndex;
  };

  const handleHideFormClick = () => {
    codeForm.current.style.maxHeight = formHidden ? '75vh' : '0';
    codeForm.current.style.opacity = formHidden ? '1' : '0';
    setFormHidden(!formHidden);
  };

  const handleClick = (event, data = {}) => {
    const selectedIndex = findSelected(data.original)
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, data);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (name) => findSelected(name) !== -1;

  const resetPage = () => {
    setTextInput('');
    setMatched([]);
    setMisses([]);
    setSelected([]);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Box style={boxStyles} display="flex" justifyContent="space-between" flexDirection="row" color="text.primary">
          <Button variant="contained" size="medium" color="secondary" className="button-hideform" style={hideBtnStyles} onClick={handleHideFormClick}>
            {
              formHidden
              ? <span style={{marginRight: '1ch'}} role="img" aria-label="nerd face emoji"> 🤓 </span>
              : <span style={{marginRight: '1ch'}} role="img" aria-label="see on evil emoji"> 🙈 </span>
            }
            { formHidden ? 'Show' : 'Hide' } form
          </Button>
          <Box color="text.primary" display="flex" justifyContent="flex-start" flexDirection="column" style={hiddenBoxStyles} ref={codeForm}>
            <Typography variant="overline" display="block" style={{ textAlign: 'left', marginRight: 'auto', fontWeight: 'bold' }}>
              Paste color names here
              (<span style={{ fontSize: '1.25em' }} role="img" aria-label="siren emoji">🚨</span>
                only one per line!)
            </Typography>

            <TextareaAutosize
              autoFocus={true}
              id="unloader"
              rowsMin={20}
              variant="outlined"
              value={textInput}
              onChange={
                (ev) => setTextInput(ev.target.value)
              }
              style={{
                backgroundColor: 'rgba(221, 221, 221, .25)',
                borderColor: '#ddd',
                color: '#000',
                padding: '1rem',
                outlineColor: '#666',
              }}
            />

            <Box display="flex" justifyContent="flex-start" flexDirection="row">
              <Button
                variant="contained"
                size="large"
                color="primary"
                style={btnStyles}
                type="submit"
                disabled={textInput.length < 1 || textInput === ''}
              >
                <span style={{ fontSize: '1.25rem' }} role="img" aria-label="magnifying glass emoji"> 🔍</span>
                &nbsp;
                Search
              </Button>

              <Button
                variant="outlined"
                size="large"
                color="default"
                style={btnStyles}
                type="button"
                disabled={textInput.length < 1 || textInput === ''}
                onClick={resetPage}
              >
                <span style={{ fontSize: '1.25rem' }} role="img" aria-label="skull emoji"> 💀 </span>
                &nbsp;
                Reset Page
              </Button>
            </Box>
          </Box>
        </Box>
      </form>
      <Box style={{ paddingBottom: '5rem' }}>
        {
          matched.length > 0
          ? <MatchedTable
              matches={matched}
            />
          : null
        }
        {
          misses.length > 0
          ? <MissedTable
            missed={misses}
            ids={newIds}
            numSelected={selected.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={misses.length}
            isSelected={isSelected}
            handleClick={handleClick}
            selected={selected}
            user={user}
            resetPage={resetPage}
          />
          : null
        }
      </Box>
    </>
  );
};

export default ColorEntryForm;
