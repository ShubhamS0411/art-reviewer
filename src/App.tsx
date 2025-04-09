import Routing from "./routes/routes";
import { ContextProvider, ContextProviderPDP} from "./client /state/Context";



function App() {
  

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
