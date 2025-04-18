import { useEffect, useState, useContext } from "react";
import { pdpID } from "../state/Context";
import axios from "axios";
import { Link } from "react-router-dom";

interface Post {
    _id: string;
    content: string;
    description: string;
    file: string;
    user: string;
    category: string;
    review?: Review[];
    createdAt: string;
    updatedAt: string;
}

interface Review {
    username: string;
    review: string;
}

export default function SimilarPost() {
    const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:4000";
    const { id, setId } = useContext(pdpID);
    const [postCollection, setPostCollection] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPostCategory = async () => {
            try {
                setLoading(true);
                const response = await axios.post(`${API_URL}/api/pdp/${id}`, {
                    withCredentials: true,
                });
                const data = response.data.idExsists;

                const categoryResponse = await axios.post(
                    `${API_URL}/api/similarPost`,
                    { category: data.category, id: id },
                    { withCredentials: true }
                );
                const categoryPosts = categoryResponse.data.checkCategory;
                setPostCollection(categoryPosts);
                setLoading(false);
            } catch (err) {
                setError("Failed to load similar posts");
                setLoading(false);
            }
        };
        fetchPostCategory();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <>
       
                {postCollection.length !== 0 && 
                 <section className="py-12 bg-gray-50 mt-4  shadow-2xl rounded-2xl">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <h2 className="text-2xl font-bold text-gray-900 mb-8">
                         Similar Posts
                     </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {postCollection.map((post) => (
                            <Link
                                onClick={() => {
                                    setId(post._id);
                                }}
                                to={`/post/${post._id}`}
                                key={post._id}
                                target="_blank"
                                className="bg-white rounded-sm shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="p-4 pb-0">
                                    <div className="flex items-center mb-4">
                                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                            @{post.user}
                                        </span>
                                    </div>
                                    {post.file.includes('.wav') || post.file.includes('.mp3') ? (
                                        <audio
                                            controls
                                            src={post.file}
                                            className="w-full h-auto"
                                        />
                                    ) : (
                                        <img
                                            src={post.file}
                                            alt={post.content}
                                            className="w-full h-48 object-cover rounded-t-sm"
                                        />
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                                        {post.content}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-3">
                                        {post.description}
                                    </p>
                                    <div className="mt-4 flex justify-between items-center">
                                        <span className="text-xs text-gray-500">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="text-xs text-blue-600 hover:underline">
                                            View Post
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                
            </div>
        </section>
       }
        </>
    );
}