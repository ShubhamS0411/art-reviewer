import Routing from "./routes/routes";
import { ContextProvider, ContextProviderPDP} from "./client /state/Context";
import axios from "axios";
import { useEffect } from "react";



function App() {
  useEffect(() => {
     axios.get('http://localhost:4000/api/refresh', { withCredentials: true })
     .then((res) => {
     console.log(res.data.message);
     })
     .catch((error) => {
     console.error(error);
     })
  },[]);

  return (
    <>
    <ContextProvider>
    <ContextProviderPDP>
  <Routing/>
    </ContextProviderPDP>
    </ContextProvider>
    </>
  )
}

export default App
