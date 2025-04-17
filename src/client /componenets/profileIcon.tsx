import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ProfileIcon() {
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:4000";
  const [name, setName] = useState<string>('');

  useEffect(() => {
    axios.get(`${API_URL}/api/userCheck`, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          setName(res.data.username);  
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);


 

  return (
    <Link to={'/profile'}>
    <div className="flex items-center justify-center">
      <div
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold"
        style={{ fontSize: '1.25rem' }}
      >
        {name.charAt(0).toUpperCase()}
      </div>
    </div>
    </Link>
  );
}
