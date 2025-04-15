import { useContext, useEffect, useState } from "react";
import { pdpID } from "../state/Context";
import axios from "axios";


interface Review {
  username: string;
  review: string;
}

interface Post {
  _id: string;
  title: string;
  description: string;
  file: string;
  user: string;
  category: string;
  review?: Review[];
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  upi: string;
  isVerified: boolean;
}

export default function PDP() {


  const { id } = useContext(pdpID);
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:4000";

  const [data, setData] = useState<Post | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState<string>("");
  const [trigger, setTrigger] = useState<boolean>(false);
  const [editComment, setEditComment] = useState<boolean>(true);

  useEffect(() => {
    const pdpAccess = async () => {
      try {
        const response = await axios.post(`${API_URL}/api/pdp/${id}`, {
          withCredentials: true,
        });
        
        const fetchedPost = response.data.idExsists;
        const fetchedUser = response.data.accountExsists;
        

        setUserData(fetchedUser);
        setData(fetchedPost);
        

        const userCheck = await axios.get(`${API_URL}/api/userCheck`, { withCredentials: true });
        const user = await userCheck.data.username;

        if (fetchedPost.user === user) {
          setEditComment(false);
        }
        
      } catch (err) {
        console.error("Failed to fetch PDP:", err);
      } finally {
        setLoading(false);
        
      }
    };
    pdpAccess();
  }, [trigger]);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/review`, { review: comment, post_id: id }, { withCredentials: true });
      setTrigger(!trigger);
      setComment("");
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!data) return <div className="p-6 text-center">No data found</div>;
  
  const comments = data.review || [];
  

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6 border border-gray-200">
        
       
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{data.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Posted by{" "}
              <span className="font-medium text-gray-700">
                {data.user}
              </span>{" "}
              on {" "}
              {new Date(data.createdAt).toLocaleDateString()}
            </p>
            {userData?.upi && (
              <p className="text-sm mt-1 text-gray-600">
                <span className="font-semibold">Support via UPI:</span> {userData.upi}
              </p>
            )}
          </div>
         
          {userData?.isVerified && (
                <span className="inline-block ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Verified
                </span>
              )}
        </div>

       
        {data.file && (
          <div className="w-full rounded-lg overflow-hidden shadow-sm border border-gray-100">
            {data.file.includes(".mp3") || data.file.includes(".wav") ? (
              <audio
                src={data.file}
                controls
                className="w-full rounded-md bg-gray-100"
              />
            ) : (
              <img
                src={data.file}
                alt={`Artwork by ${data.user}`}
                className="w-full max-h-[80vh] object-contain rounded-md"
                loading="lazy"
              />
            )}
          </div>
        )}

       
        <div className="text-gray-800 leading-relaxed text-base whitespace-pre-wrap">
          {data.description}
        </div>

        
        <div className="border-t pt-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Comments ({comments.length})
          </h2>
          {editComment &&(
          <div className="flex items-center gap-2 mb-2 rounded-md py-2 shadow-sm bg-white w-full max-w-md">
                 <input 
                    type="text" 
                    placeholder="Add a comment..." 
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition" onClick={handleSubmit}>
                    Submit
                </button>
              </div>
              )}
          {comments.length > 0 ? (
            <ul className="space-y-4">
              {comments.map((comment, index) => (
                <li
                  key={index}
                  className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm"
                >
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-800">{comment.username}</span>:{" "}
                    {comment.review}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No comments yet.</p>
          )}
        </div>

        <p className="text-xs text-gray-400 text-right">
          Last updated: {new Date(data.updatedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
