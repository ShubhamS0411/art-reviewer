import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { LogStatus } from "../state/Context";

interface Post {
    content: string;
    description: string;
    file: string;
    user: string;
    account: {
        isVerified: boolean;
    };
}

export default function NewPost() {
    const { status } = useContext(LogStatus);
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/getPost");
                setPosts(response.data.newPost);
            } catch (error) {
                console.error("Failed to fetch new posts:", error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 bg-white">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">🎥 Latest Highlights</h2>
                <Link
                    to={status ? "/dashboard" : "/signin"}
                    className="text-white font-semibold hover:underline text-sm sm:text-base bg-blue-600 p-2 shadow-2xl border rounded-xl"
                >
                    Explore All →
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {posts.map((post, index) => {
                    const isAudio = post.file?.includes(".mp3") || post.file?.includes(".wav");
                    const isVerified = post.account?.isVerified;

                    return (
                        <div
                            key={index}
                            className={`group relative overflow-hidden rounded-2xl border p-5  transition-transform duration-300 ${
                                isVerified
                                    ? "bg-gradient-to-br from-orange-600 to-black text-white border-gray-200 shadow-xl hover:scale-[1.03]"
                                    : "bg-gray-50 text-gray-900 border-gray-200 hover:shadow-lg"
                            }`}
                        >
                            {isVerified && (
                                <div className="absolute top-3 right-3 z-10 bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded-full shadow">
                                    VERIFIED
                                </div>
                            )}

                            <p className={`text-xs font-semibold mb-3 ${isVerified ? "text-gray-200" : "text-gray-500"}`}>
                                By: {post.user}
                            </p>

                            {post.file && (
                                <div className="mb-4 rounded-lg overflow-hidden">
                                    {isAudio ? (
                                        <audio
                                            controls
                                            src={post.file}
                                            className="w-full h-20"
                                            aria-label={`Audio post by ${post.user}`}
                                        />
                                    ) : (
                                        <img
                                            src={post.file}
                                            alt={`${post.content} by ${post.user}`}
                                            className="w-full h-auto object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                                        />
                                    )}
                                </div>
                            )}

                            <h3 className={`text-lg font-bold mb-1 ${isVerified ? "text-white" : "text-gray-800"}`}>
                                {post.content}
                            </h3>
                            <p className={`text-sm ${isVerified ? "text-gray-300" : "text-gray-600"}`}>
                                {post.description.length > 100
                                    ? post.description.substring(0, 100) + "..."
                                    : post.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
