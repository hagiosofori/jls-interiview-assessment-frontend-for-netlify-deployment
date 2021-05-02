import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useState} from 'react';


function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);

  return <>
    {loading ? <img src='./loading-bar.svg' width='100%' height='10px' /> : null}
    <Component
      loading={loading}
      setLoading={setLoading}
      {...pageProps}
    />
  </>;
}

export default MyApp;
