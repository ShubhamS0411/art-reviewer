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
            <meta name="description" content="Join Art Review to share and review artwork with our creative community" />
            <meta name="keywords" content="art review, art community, artwork sharing" />
        </Helmet>
        <div className="w-full mt-6">
            {user_type !== "Reviewer" && <Post />}
            <div className="max-w-6xl mx-auto mt-6 p-4">
                <h1 className="text-2xl font-bold text-center mb-6">View Artworks</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" aria-label="post collection">
                    {postCollection.map((post, index) => (
                        <article key={index} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col items-center text-center">
               
                            <h2 className="bg-gray-300 rounded-full flex items-center justify-center text-black font-semibold py-2 px-4 text-lg">
                                {post.user}
                            </h2>

                          
                            <p className="mt-3 text-black text-base font-medium">{post.content}</p>

                            
                            {post.file && ( 
                                <div className="mt-4 w-full">
                                    {post.file.includes('.mp3')|| post.file.includes('.wav') ? <audio src={post.file} controls className="w-full max-w-md mx-auto my-4 rounded-lg overflow-hidden shadow-md bg-gray-100"/> :<img src={post.file} alt={`Attached media ${post.user}`} className="rounded-lg w-full h-40 object-cover" loading="lazy"/>}
                                    
                                </div>
                            )}

                          
                            {post.review  && post.review.length > 0 && (
                                <div className="mt-4 w-full">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Reviews</h3>
                                    <div className="max-h-40 overflow-y-auto space-y-3 p-2 bg-gray-50 rounded-lg shadow-inner border border-gray-200">
                                        {post.review.map((review, reviewIndex) => (
                                            <div key={reviewIndex} className="p-3 bg-white rounded-lg shadow-sm border border-gray-300 flex items-start gap-3">
                                                <div className="flex-1">
                                                    <p className="text-gray-900 font-semibold">{review.username}</p>
                                                    <p className="text-gray-700 text-sm">{review.review}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                          
                            {user_type === "Reviewer" && (
                                <form onSubmit={(e) => handleSubmit(e, index)} className="mt-6 flex flex-col items-center w-full">
                                    <input
                                        type="text"
                                        className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                        placeholder="Write a review..."
                                        onChange={(e) => reviewSelector(e, index)}
                                        value={review[index] || ""}
                                    />
                                    <button
                                        type="submit"
                                        className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all shadow-md">
                                        Submit Review
                                    </button>
                                </form>
                            )}

                            
                            {error[index] && (
                                <div className="mt-4 w-full bg-red-100 p-3 rounded-lg border border-red-400 text-red-600">
                                    <p>{error[index]}</p>
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
