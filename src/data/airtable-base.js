import axios from 'axios';
import { useState } from 'react';
const Airtable = require('airtable');
require('dotenv').config();

// pull sensitive data from .env file
const {
  REACT_APP_AIRTABLE_API_KEY,
  REACT_APP_AIRTABLE_BASE_ID,
  REACT_APP_AIRTABLE_TABLE_ID
} = process.env;

//content type to send with all POST requests
axios.defaults.headers.post['Content-Type'] = 'application/json';
//authenticate to the base with the API key
axios.defaults.headers['Authorization'] = `Bearer ${REACT_APP_AIRTABLE_API_KEY}`;

// create a new instance of the Airtable API
export const airtableBase = new Airtable({
  apiKey: REACT_APP_AIRTABLE_API_KEY
}).base(REACT_APP_AIRTABLE_BASE_ID);

// custom hook to fetch all records from the table
export function useAirtableData() {
  const [airtableData, setAirtableData] = useState(null);
  const baseUrl = `https://api.airtable.com/v0/${REACT_APP_AIRTABLE_BASE_ID}/${REACT_APP_AIRTABLE_TABLE_ID}/`;
  let params = { pageSize: 100 };
  let results = []

  // Airtable only allows 100 records per page,
  // so we need to request all pages, using the offset
  // returned in the previous request
  // https://airtable.com/api#offset
  //
  // the complete set is stored in `results`
  //
  // @TODO: add better error handling
  const getData = async () => axios({
    baseURL: baseUrl,
    params: params
  }).then((res) => {
    results.push(...res.data.records);
    params.offset = res.data.offset;

    const axcall = () => {
      axios({
        baseURL: baseUrl,
        params: params
      }).then((res) => {
        results.push(...res.data.records);
        params.offset = res.data.offset;

        if (res.data.offset !== undefined) {
          // if there are more pages, recursively call this function
          return axcall();
        } else {
          // after all calls ends, set the state
          setAirtableData(results);
        }
      }).catch((e) => console.log(e))
    }

    axcall();
  }).catch((e) => console.log(e) );

  return {
    getData,
    airtableData
  }
}

// Abondoned in favor of using the Airtable API directly
//
// export function useNewAirtableData(data = {}) {
//   const [newData, setNewData] = useState(null);

//   const setData = async () => axios.post(`https://api.airtable.com/v0/${REACT_APP_AIRTABLE_BASE_ID}/Table%201/`, data)
//     .then((resp) => setNewData(resp))
//     .catch((error) => console.error(`Error setting data: ${error}`));

//     return {
//       setData,
//       newData
//     };
// }
