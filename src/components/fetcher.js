import React from 'react';

const Fetcher = React.memo(({ data }) => {
  return (
    <>
      <h3>Airtable Data</h3>
      {data &&
        <pre className="logger">
          <code className="logger__code">
              {JSON.stringify(data, null, 2)}
          </code>
        </pre>
      }
    </>
  );
});

export default Fetcher;
