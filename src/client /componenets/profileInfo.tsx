import { useEffect, useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { FaEdit,  FaCheck} from "react-icons/fa"; 

interface Profile {
  username: string;
  email: string;
  upi: string;
  isVerified: boolean;
  account_type: string[];
  _id: string;
}

export default function ProfileInfo() {
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:4000";
  const [profile, setProfile] = useState<Profile | null>(null);
  const [edit, setEdit] = useState<{ username: boolean; upi: boolean }>({
    username: false,
    upi: false,
  });
  const [change, setChange] = useState<string>("");
  const [error, setError] = useState<{ error: string; success: string }>({
    error: "",
    success: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/userCheck`, {
          withCredentials: true,
        });
        const data = await response.data.userExsists;
        setChange(data.upi);
        setProfile(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    const sanitizeUpi = DOMPurify.sanitize(change);
     

    try {
      const response = await axios.post(
        `${API_URL}/api/profileEdit`,
        { upi: sanitizeUpi },
        { withCredentials: true }
      );
      if (response.status === 200 || response.status === 400) {
        setError((prev) => ({ ...prev, success: response.data.message }));
        setTimeout(() => {
          window.location.reload(); 
        },1000)
        
      }
    } catch (err: any) {
      setError((prev) => ({ ...prev, error: err.response.data.message }));
      console.error(err);
    }
  };
  
  

  return (
    <div className="flex justify-center items-center flex-col px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Profile Info</h1>

      <div className="w-full max-w-md border border-gray-300 p-6 space-y-4 shadow-md rounded-md bg-white">
        {/* Username */}
        <div className="flex justify-between items-start gap-4">
          <div className="w-full">
            <p className="text-sm text-gray-600 mb-1">Username</p> 
              <p className="text-base font-medium">{profile?.username}</p>
          </div>
        </div>

        {/* Email */}
        <div>
          <p className="text-sm text-gray-600 mb-1">Email</p>
          <p className="text-base font-medium">{profile?.email}</p>
        </div>

        {/* UPI */}
        <div className="flex justify-between items-start gap-4">
          <div className="w-full">
            <p className="text-sm text-gray-600 mb-1">UPI</p>
            {!edit.upi ? (
              <p className="text-base font-medium">{profile?.upi}</p>
            ) : (
              <input
                type="text"
                onChange={(e) =>
                  setChange(e.target.value)
                }
                value={change}
                placeholder="Enter UPI"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            )}
          </div>
          <button
            onClick={() => {
              setEdit((prev) => ({ ...prev, upi: !prev.upi }));
              
            }}
            className="mt-6 text-xl hover:bg-gray-100 rounded px-2 py-1 transition"
          
          >
            {edit.upi ? (
              <FaCheck onClick={handleSubmit}/>
            ) : (
              <FaEdit />
            )}
          </button>
        </div>

        {/* Account Type */}
        <div>
          <p className="text-sm text-gray-600 mb-1">Account Type</p>
          <p className="text-base font-medium">{profile?.account_type.map((item) => item + " " )}</p>
        </div>

        {/* Verification Status */}
        <div>
          <p className="text-sm text-gray-600 mb-1">Verification Status</p>
          <p
            className={`text-base font-semibold ${
              profile?.isVerified ? "text-green-600" : "text-red-500"
            }`}
          >
            {profile?.isVerified ? "Verified" : "Not Verified"}
          </p>
        </div>

        {/* Error / Success */}
        {error.error && <p className="text-sm text-red-500">{error.error}</p>}
        {error.success && <p className="text-sm text-green-500">{error.success}</p>}
      </div>
      <p className="text-gray mt-2 text-gray-500">Note: You Can Only Change UPI For Now</p>
    </div>
  );
}
