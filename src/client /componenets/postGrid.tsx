import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import dompurify from "dompurify";
import Post from "./post";
import Helmet from "react-helmet";

interface Review {
    username: string;
    review: string;
}
interface Post {
    description: string;
    _id: string;
    event: any;
    user: string;
    content: string;
    file: string;
    review?: Review[];
}

export default function PostGrid() {
    const [postCollection, setPostCollection] = useState<Post[]>([]);
    const [user_type, setUserType] = useState<string>("");
    const [review, setReview] = useState<{ [key: number]: string }>({});
    const [error, setError] = useState<{ [key: number]: string }>({});
    const [trigger, setTrigger] = useState<boolean>(false);
    const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:4000";
    

    useEffect(() => {
        axios.get(`${API_URL}/api/getPost`, { withCredentials: true })
            .then((res) => {
                if (res.status === 200) {
                    setPostCollection(res.data.posts);
                    setUserType(res.data.role);
                }
            })
            .catch((error) => {
                console.error("Error fetching posts:", error);
            });
    }, [trigger]);

    const handleSubmit = useCallback((event: React.FormEvent, index: number) => {
        event.preventDefault();
        const sanitisedReview = dompurify.sanitize(review[index]);

        if (!sanitisedReview || !sanitisedReview.trim()) {
            setError((prev) => ({ ...prev, [index]: "Please enter a review" }));
            return;
        }

        axios.post(`${API_URL}/api/review`, { review: sanitisedReview, post_id: postCollection[index]._id }, {
            withCredentials: true
        }).then(()=> {setTrigger((prev) => !prev);
        setError((prev) => ({ ...prev, [index]: "" }));
        setReview((prev) => ({ ...prev, [index]: "" }));})
       
        
    },[postCollection, review]);

    const reviewSelector = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        setReview((prev) => ({ ...prev, [index]: event.target.value }));
    };

    return (
        <>
          <Helmet>
            <title>Art Review - Community Art Platform</title>
            <meta
              name="description"
              content="Join Art Review to share and review artwork with our creative community"
            />
            <meta
              name="keywords"
              content="art review, art community, artwork sharing"
            />
          </Helmet>
          <div className="w-full mt-6">
            {user_type !== "Reviewer" && <Post />}
            <div className="max-w-6xl mx-auto mt-6 p-4">
              <h1 className="text-2xl font-bold text-center mb-6">View Artworks</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {postCollection.map((post, index) => (
                  <article
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col items-start space-y-4"
                  >
                    <div className="self-center bg-gray-200 px-4 py-2 rounded-full shadow-sm text-center font-semibold text-gray-800 text-lg">
                      {post.user}
                    </div>
      
                    <h2 className="text-xl font-bold text-gray-900 w-full break-words text-center">
                      {post.content}
                    </h2>
      
                    <p className="text-gray-700 text-sm w-full text-left">
                      {post.description}
                    </p>
      
                    {post.file && (
                      <div className="w-full">
                        {post.file.includes(".mp3") || post.file.includes(".wav") ? (
                          <audio
                            src={post.file}
                            controls
                            className="w-full rounded-md mt-2 bg-gray-100 shadow-inner"
                          />
                        ) : (
                          <img
                            src={post.file}
                            alt={`Artwork by ${post.user}`}
                            className="w-full h-48 object-cover rounded-md shadow-sm border"
                            loading="lazy"
                          />
                        )}
                      </div>
                    )}
      
                    {post.review && post.review.length > 0 && (
                      <div className="w-full mt-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Reviews
                        </h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto bg-gray-50 rounded-md p-2 border border-gray-200">
                          {post.review.map((r, idx) => (
                            <div
                              key={idx}
                              className="bg-white p-3 rounded-md shadow-sm border border-gray-300"
                            >
                              <p className="text-sm font-semibold text-gray-900">
                                {r.username}
                              </p>
                              <p className="text-sm text-gray-700">{r.review}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
      
                    {user_type === "Reviewer" && (
                      <form
                        onSubmit={(e) => handleSubmit(e, index)}
                        className="w-full mt-4 flex flex-col items-stretch space-y-2"
                      >
                        <input
                          type="text"
                          placeholder="Write your review..."
                          value={review[index] || ""}
                          onChange={(e) => reviewSelector(e, index)}
                          className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-all shadow-md"
                        >
                          Submit Review
                        </button>
                      </form>
                    )}
      
                    {error[index] && (
                      <div className="w-full mt-2 bg-red-100 text-red-700 p-2 rounded-md border border-red-300 text-sm">
                        {error[index]}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </>
      );
    }      
