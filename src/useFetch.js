import React from 'react';

const useFetch = (url, opts) => {
  const [response, setResponse] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);

    fetch(url, opts)
      .then((res) => {
        console.log({res});
        setResponse(res.data);
        setLoading(false);
      })
      .catch(() => {
        setHasError(true);
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return [ response, loading, hasError ];
};

export default useFetch;
