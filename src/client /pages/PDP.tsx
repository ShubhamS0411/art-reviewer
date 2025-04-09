import { useContext, useEffect, useState } from "react";
import { pdpID } from "../state/Context";
import axios from "axios";

export default function PDP() {
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
    review?: Review[]; 
    createdAt: string;
    updatedAt: string;
  }

  const { id } = useContext(pdpID);
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:4000";

  const [data, setData] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pdpAccess = async () => {
      try {
        const response = await axios.post(`${API_URL}/api/pdp/${id}`, { withCredentials: true });
        const fetchedData = response.data.idExsists;
      
          setData(fetchedData);
        
      } catch (err) {
        console.error("Failed to fetch PDP:", err);
      } finally {
        setLoading(false);
      }
    };
      pdpAccess();
    
  }, []);

 
  

  if (loading) return <div className="p-6">Loading...</div>;
  if (!data) return <div className="p-6">No data found</div>;

  
  const comments = data.review || [];
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 space-y-4">
        <h1 className="text-3xl font-bold">{data.title}</h1>
        <p className="text-gray-600">Posted by: <span className="font-medium">{data.user}</span></p>

        {data.file && (
          <div className="my-4">
            {data.file.includes(".mp3") || data.file.includes(".wav") ? (
                          <audio
                            src={data.file}
                            controls
                            className="w-full rounded-md mt-2 bg-gray-100 shadow-inner"
                          />
                        ) : (
                          <img
                            src={data.file}
                            alt={`Artwork by ${data.user}`}
                            className="w-full max-h-[400px] object-cover rounded-lg"
                            loading="lazy"
                          />                    
        )}
      </div>
    )}

        <p className="text-gray-800">{data.description}</p>

        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">Comments ({comments.length})</h2>
          {comments.length > 0 ? (
            <ul className="space-y-2">
              {comments.map((comment, index) => (
                <li key={index} className="bg-gray-100 p-3 rounded text-gray-700">
                  <span className="font-semibold">{comment.username}</span>: {comment.review}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>

        <p className="text-sm text-gray-400 mt-4">Created at: {new Date(data.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
