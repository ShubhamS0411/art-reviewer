import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { JSX, lazy, Suspense } from "react";
import { useContext } from "react";
import { LogStatus } from "../client /state/Context";





const Header = lazy(() => import("../client /componenets/header"));
const Homepage = lazy(() => import("../client /pages/Homepage"));
const Signin = lazy(() => import("../client /componenets/signin"));
const Signup = lazy(() => import("../client /componenets/signup"));
const Dashboard = lazy(() => import("../client /pages/dashboard"));
const PDP = lazy(() => import("../client /pages/PDP"));
const Footer = lazy(() => import("../client /componenets/footer"));
const ProfileInfo = lazy(() => import("../client /componenets/profileInfo"));
export default function Routing(){
 
   const ProtectedRoute = ({children}: {children: JSX.Element}) => {
     const { status } = useContext(LogStatus);
     if (!status){
       return <Navigate to="/signin" />
     }
     return children
   }
 
  const Layout = ({children}: {children: JSX.Element}) => {
    return(
      <>
      <Header/>
      {children}
      <Footer/>
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
        <Route path="/profile" element={<ProtectedRoute><ProfileInfo/></ProtectedRoute>}/>
      </Routes>
      </Layout>
      </Suspense>
    </BrowserRouter>
  )

}