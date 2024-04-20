import './App.css';
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    (async () => {
      try {
        const response: Record<string, string> = (await axios.get("api/v1/heartbeat")).data;
        console.log(response);        
        setMessage(response["message"]);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return <>
    <p>{message}</p>
  </>
}

export default App;
