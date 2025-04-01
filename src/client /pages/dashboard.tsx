import { useEffect } from "react";
import PostGrid from "../componenets/postGrid";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:4000";
    const navigate = useNavigate();
  useEffect(() => {
     axios.get(`${API_URL}/api/authentication`, { withCredentials: true })
     .catch((error) => {
     if (error.response.status === 401) {
     navigate("/signin");
    
     }})
  },[])
    return (
        <>
              <PostGrid />
        </>
    );
}
