import Routing from "./routes/routes";
import { ContextProvider } from "./client /state/Context";



function App() {
  

  return (
    <>
    <ContextProvider>
  <Routing/>
    </ContextProvider>
    </>
  )
}

export default App
