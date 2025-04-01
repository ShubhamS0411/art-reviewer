import { useState } from "react";
import { Helmet } from "react-helmet";
import dompurify from "dompurify";
import axios from "axios";

export default function CreatePost() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [art, setArt] = useState<{title: string, file: File | null}>({ title: "", file: null });
  const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:4000';

  const [error,setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sanitizedTitle = dompurify.sanitize(art.title.trim());
    const formData = new FormData();
    formData.append('file', art.file ?? '');
    const allowedFileType = ["image/png", "image/jpeg", "image/jpg", "video/mp4", "audio/mp3", "audio/wav",""];
    if(!allowedFileType.includes(art.file?.type ?? "")){
       setError("Unsupported File Type");
       return; 
    }
    if(!art.title || !art.title.trim().length || art.title.length < 20){
        setError("Please Elaborate Your Artwork More");
        return;
    }
    axios.post(`${API_URL}/api/post`, {content: sanitizedTitle, file: formData}, {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true
    })
    .then((res) => {
        if(res.status === 200) {
            setArt({title: "", file: new File([], "")});
            setShowModal(false);
            setError(res.data.message);
        }
    })
    .catch((error) => {
        setError(error.response.data.message);
        console.log(error);
  }
    );
  };

  return (
    <>
     <Helmet>
        <title>Post Your Art</title>
        <meta name="description" content="Join Art Review to share and review artwork with our creative community"/>
        <meta name="keywords" content="art review, art community, artwork sharing"/>
     </Helmet>
      <div className="flex justify-center mt-10">
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 font-medium shadow-md"
        >
          Share Your Art
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50" aria-label="cross">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] md:w-[500px] relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-600 hover:text-gray-800 text-xl"
            >
              ✕
            </button>

            <section aria-label="create post" className="text-center flex flex-col items-center">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                Share Your Art
              </h1>
              <form className="w-full" onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-4">
                  <div className="text-left">
                    <label htmlFor="title" className="text-lg font-medium text-gray-700">
                      Mention About Your Artwork
                    </label>
                    <input
                      type="text"
                      id="title"
                      placeholder="Artwork Title"
                      value={art.title}
                      onChange={(e) => setArt({...art, title: e.target.value})}
                      required
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="text-left">
                    <label htmlFor="file" className="text-lg font-medium text-gray-700">
                      Upload Your Artwork
                    </label>
                    <input
                      type="file"
                      id="file"
                      alt="image or video"
                      onChange={(e) => setArt({...art, file: e.target.files![0]})}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 file:bg-blue-600 file:text-white file:rounded-md file:px-3 file:py-1.5 file:border-0 hover:file:bg-blue-700 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all duration-300 font-medium shadow-md"
                    aria-label="submit"
                  >
                    Submit
                  </button>
                  {error && <p className={error.includes('Successfully') ? "text-green-600" : "text-red-600"}>{error}</p>}
                </div>
              </form>
            </section>
          </div>
        </div>
      )}
    </>
  );
}
