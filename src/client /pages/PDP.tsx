import { useContext, useEffect, useState, lazy, Suspense } from "react";
import { pdpID } from "../state/Context";
import axios from "axios";

const SimilarPost = lazy(() => import("../componenets/similarPost"));

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

        const userCheck = await axios.get(`${API_URL}/api/userCheck`, {
          withCredentials: true,
        });
        const user = userCheck.data.username;

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
      await axios.post(
        `${API_URL}/api/review`,
        { review: comment, post_id: id },
        { withCredentials: true }
      );
      setTrigger(!trigger);
      setComment("");
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-xl text-gray-600">No data found</p>
      </div>
    );
  }

  const comments = data.review || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
      <div className="bg-white shadow-2xl rounded-2xl p-10 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {data.title || "Untitled Post"}
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-500">
                By{" "}
                <span className="font-semibold text-gray-800">{data.user}</span> •{" "}
                {new Date(data.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              {userData?.isVerified && (
                <span className="inline-flex items-center bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  <svg
                    className="w-3 h-3 mr-1"
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
                </span>
              )}
            </div>
            {userData?.upi && (
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Support via UPI:</span>{" "}
                <span className="text-blue-600">{userData.upi}</span>
              </p>
            )}
          </div>
        </div>

        {data.file && (
          <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-100">
            {data.file.includes(".mp3") || data.file.includes(".wav") ? (
              <audio
                src={data.file}
                controls
                className="w-full max-h-fit object-contain rounded-xl transition-transform duration-300 hover:scale-[1.02]"
                aria-label={`Audio by ${data.user}`}
              />
            ) : (
              <img
                src={data.file}
                alt={data.title || `Artwork by ${data.user}`}
                className="w-full max-h-fit object-contain rounded-xl transition-transform duration-300 hover:scale-[1.02]"
                loading="lazy"
              />
            )}
          </div>
        )}

        <div className="text-gray-700 leading-7 text-lg whitespace-pre-wrap prose">
          {data.description || "No description provided."}
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Comments ({comments.length})
          </h2>
          {editComment && (
            <form className="flex items-center gap-4 mb-8 bg-gray-100 p-6 rounded-xl shadow-sm transition-shadow duration-300 hover:shadow-md">
              <input
                type="text"
                placeholder="Share your thoughts..."
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                className="flex-1 px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 placeholder-gray-400 transition-colors duration-200"
                aria-label="Comment input"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={!comment.trim()}
                aria-label="Submit comment"
              >
                Post
              </button>
            </form>
          )}
          {comments.length > 0 ? (
            <ul className="space-y-5">
              {comments.map((comment, index) => (
                <li
                  key={index}
                  className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm transition-shadow duration-300 hover:shadow-md"
                >
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">
                      {comment.username}
                    </span>
                    <span className="text-gray-500"> • {comment.review}</span>
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm italic">
              Be the first to comment!
            </p>
          )}
        </div>

        <p className="text-xs text-gray-400 text-right">
          Last updated: {new Date(data.updatedAt).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        }
      >
        <SimilarPost />
      </Suspense>
    </div>
  );
}