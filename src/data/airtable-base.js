import { useState } from 'react';
import axios from 'axios';
const Airtable = require('airtable');
require('dotenv').config();

const {
  REACT_APP_AIRTABLE_API_KEY,
  REACT_APP_AIRTABLE_BASE_ID
} = process.env;

//content type to send with all POST requests
axios.defaults.headers.post['Content-Type'] = 'application/json';
//authenticate to the base with the API key
axios.defaults.headers['Authorization'] = `Bearer ${REACT_APP_AIRTABLE_API_KEY}`;

export const airtableBase = new Airtable({
  apiKey: REACT_APP_AIRTABLE_API_KEY
}).base(REACT_APP_AIRTABLE_BASE_ID);

export function useAirtableData() {
  const [airtableData, setAirtableData] = useState(null);

  const getData = async () => axios.get(`https://api.airtable.com/v0/${REACT_APP_AIRTABLE_BASE_ID}/Table%201/`).then((res) => {
    setAirtableData(res.data.records);
  });

  return {
    getData,
    airtableData
  }
}

export function useNewAirtableData(data = {}) {
  const [newData, setNewData] = useState(null);

  const setData = async () => axios.post(`https://api.airtable.com/v0/${REACT_APP_AIRTABLE_BASE_ID}/Table%201/`, data)
    .then((resp) => setNewData(resp))
    .catch((error) => console.error(`Error setting data: ${error}`));

    return {
      setData,
      newData
    };
}
