import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";



const Header = lazy(() => import("../client /componenets/header"));
const Homepage = lazy(() => import("../client /pages/Homepage"));
const Signin = lazy(() => import("../client /componenets/signin"));
const Signup = lazy(() => import("../client /componenets/signup"));
const Dashboard = lazy(() => import("../client /pages/dashboard"));
const PDP = lazy(() => import("../client /pages/PDP"));

export default function Routing(){

 
  const Layout = ({children}: {children: React.ReactNode}) => {
    return(
      <>
      <Header/>
      {children}
      </>
    )
  }
  
  
 return (
    <BrowserRouter>
    <Suspense fallback={<div>Loading...</div>}>
    <Layout>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/signin" element={<Signin/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/dashboard" element={<Dashboard /> } />
        <Route path="*" element={<Homepage/>}/>
        <Route path="/post/:id" element={<PDP/>} />
      </Routes>
      </Layout>
      </Suspense>
    </BrowserRouter>
  )

}