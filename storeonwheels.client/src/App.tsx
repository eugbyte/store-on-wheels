import { useEffect, useState } from "react";
import axios from "axios";
import { MapBoxPage } from "~/pages/map-box";

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

  return (
    <div className="bg-slate-800 text-white px-2 h-full">
      <p>{message}</p>
      <MapBoxPage />
    </div>
  );
}

export default App;
