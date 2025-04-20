import axios from "axios";
import { useEffect, useState, useCallback, useContext } from "react";
import dompurify from "dompurify";
import Post from "./post";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import { pdpID } from "../state/Context";

interface Review {
  username: string;
  review: string;
  account: {
    isVerified: boolean;
  }
}
interface Post {
  description: string;
  _id: string;
  event: any;
  user: string;
  content: string;
  file: string;
  review?: Review[];
  account: {
    isVerified: boolean;
  };
}

export default function PostGrid() {
  const [postCollection, setPostCollection] = useState<Post[]>([]);
  const [user_type, setUserType] = useState<string>("");
  const [review, setReview] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState<{ [key: number]: string }>({});
  const [trigger, setTrigger] = useState<boolean>(false);
  const [userCheck, setUserCheck] = useState<string>('');
  const { setId } = useContext(pdpID);
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:4000";

  useEffect(() => {
    axios
      .get(`${API_URL}/api/getPost`, { withCredentials: true })
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

  useEffect(() => {
    axios.get(`${API_URL}/api/userCheck`, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          setUserCheck(res.data.username);
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent, index: number) => {
      event.preventDefault();
      const sanitisedReview = dompurify.sanitize(review[index]);

      if (!sanitisedReview || !sanitisedReview.trim()) {
        setError((prev) => ({ ...prev, [index]: "Please enter a review" }));
        return;
      }

      axios
        .post(
          `${API_URL}/api/review`,
          { review: sanitisedReview, post_id: postCollection[index]._id },
          { withCredentials: true }
        )
        .then(() => {
          setTrigger((prev) => !prev);
          setError((prev) => ({ ...prev, [index]: "" }));
          setReview((prev) => ({ ...prev, [index]: "" }));
        });
    },
    [postCollection, review]
  );

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

      <div className="w-full mt-6 overflow-x-hidden">
        <div className="max-w-6xl mx-auto mt-6 p-4">
          <h1 className="text-4xl font-bold text-center mb-4">View Artworks</h1>
          {user_type.includes("Creator") && <Post />}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {postCollection.map((post, index) => (
              <article
                key={index}
                className={
                  post.account.isVerified
                    ? "bg-gradient-to-r from-orange-700 to-gray-950 text-white p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col items-start space-y-4 h-auto transform hover:scale-105 transition-transform duration-300"
                    : "bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col items-start space-y-4 h-auto"
                }
              >
                {post.account.isVerified && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
                   Verified
                  </div>
                )}
                <div className={
                  post.account.isVerified
                    ? "self-center bg-opacity-50 bg-white px-4 py-2 rounded-full shadow-sm text-center font-semibold text-gray-800 text-lg"
                    : "self-center bg-gray-200 px-4 py-2 rounded-full shadow-sm text-center font-semibold text-gray-800 text-lg"
                }>
                  {post.user}
                </div>

                {post.file && (
                  <div className="w-full my-2">
                    {post.file.includes(".mp3") || post.file.includes(".wav") ? (
                      <audio
                        src={post.file}
                        controls
                        className="w-full object-contain h-auto rounded-md mt-2 bg-gray-100 shadow-inner"
                      />
                    ) : (
                      <Link to={`/post/${post._id}`} onClick={() => setId(post._id)} target="_blank">
                        <img
                          src={post.file}
                          alt={`Artwork by ${post.user}`}
                          className="w-full h-auto object-contain rounded-md shadow-sm border"
                          loading="lazy"
                        />
                      </Link>
                    )}
                  </div>
                )}

                <Link to={`/post/${post._id}`} onClick={() => setId(post._id)} target="_blank">
                  <h2 className={post.account.isVerified ? "text-2xl font-bold text-white w-full break-words  text-center mt-2" : "text-xl font-bold text-black w-full break-words text-center mt-2"}>
                    {post.content}
                  </h2>

                  <p className={
                    post.account.isVerified
                      ? "text-gray-200 text-sm w-auto text-left mt-2"
                      : "text-gray-700 text-sm w-full text-left mt-2"
                  }>
                    {post.description && post.description.length > 100 ? (
                      <>
                        {post.description.substring(0, 100)}
                        <button className="ml-1 hover:scale-105 font-semibold text-sm  px-1 underline rounded-xl shadow-md transition duration-300 ease-in-out truncate w-20">
                          Explore More
                        </button>
                      </>
                    ) : (
                      post.description
                    )}
                  </p>
                </Link>

                {post.review && post.review.length > 0 && (
                  <div className="w-full mt-4">
                    <h3 className={
                      post.account.isVerified
                        ? "text-lg font-semibold text-gray-100 mb-2"
                        : "text-lg font-semibold text-gray-800 mb-2"
                    }>
                      Reviews ({post.review.length})
                    </h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto bg-gray-50 rounded-md p-2 border border-gray-200">
                      {post.review.map((r, idx) => (
                        <div
                        key={idx}
                        className={
                          r.account?.isVerified
                            ? "bg-gradient-to-r from-orange-700 to-gray-950 text-white p-3 rounded-md shadow-lg border border-gray-200 transform hover:scale-105 transition-transform duration-300"
                            : "bg-white p-3 rounded-md shadow-sm border border-gray-300"
                        }
                      >
                        {r.account?.isVerified && (
                          <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
                            Verified
                          </div>
                        )}
                        <p className={
                          r.account?.isVerified
                            ? "text-sm font-semibold text-gray-100 underline"
                            : "text-sm font-semibold text-gray-900 underline"
                        }>
                          @{r.username}
                        </p>
                        <p className={
                          r.account?.isVerified
                            ? "text-sm text-gray-200"
                            : "text-sm text-gray-700"
                        }>
                          {r.review}
                        </p>
                      </div>
                      ))}
                    </div>
                  </div>
                )}

                {user_type.includes("Reviewer") && post.user !== userCheck && (
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