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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-lg mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8 text-center">
          Profile Information
        </h1>

        <div className="space-y-6">
          {/* Username */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">Username</p>
              <p className="text-lg font-semibold text-gray-900">
                {profile?.username || "N/A"}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">Email</p>
              <p className="text-lg font-semibold text-gray-900">
                {profile?.email || "N/A"}
              </p>
            </div>
          </div>

          {/* UPI */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex-1">
              <p className="text-sm text-gray-500 font-medium">UPI</p>
              {!edit.upi ? (
                <p className="text-lg font-semibold text-gray-900">
                  {profile?.upi || "Not set"}
                </p>
              ) : (
                <input
                  type="text"
                  onChange={(e) => setChange(e.target.value)}
                  value={change}
                  placeholder="Enter UPI ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 placeholder-gray-400 transition-colors duration-200"
                  aria-label="UPI input"
                />
              )}
            </div>
            <button
              onClick={() => {
                setEdit((prev) => ({ ...prev, upi: !prev.upi }));
                if (edit.upi) handleSubmit();
              }}
              className="ml-4 p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label={edit.upi ? "Save UPI" : "Edit UPI"}
            >
              {edit.upi ? (
                <FaCheck className="w-5 h-5 text-green-600" />
              ) : (
                <FaEdit className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Account Type */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">Account Type</p>
              <p className="text-lg font-semibold text-gray-900">
                {profile?.account_type?.join(", ") || "None"}
              </p>
            </div>
          </div>

          {/* Verification Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Verification Status
              </p>
              <p
                className={`text-lg font-semibold flex items-center gap-2 ${
                  profile?.isVerified ? "text-green-600" : "text-red-500"
                }`}
              >
                {profile?.isVerified ? (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified
                  </>
                ) : (
                  "Not Verified"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Error / Success Messages */}
        {(error.error || error.success) && (
          <div className="mt-6 p-4 rounded-lg shadow-sm text-center">
            {error.error && (
              <p className="text-sm text-red-500">{error.error}</p>
            )}
            {error.success && (
              <p className="text-sm text-green-500">{error.success}</p>
            )}
          </div>
        )}

        <p className="text-sm text-gray-500 mt-6 text-center">
          Note: You can only edit your UPI ID at this time.
        </p>
      </div>
    </div>
  );
}
