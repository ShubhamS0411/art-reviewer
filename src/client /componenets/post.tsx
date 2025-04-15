import { useState } from "react";
import { Helmet } from "react-helmet";
import dompurify from "dompurify";
import axios from "axios";


export default function CreatePost() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [art, setArt] = useState<{title: string, description: string, category: string, file: File | null}>({ title: "", description: "", category: "", file: null });

  const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:4000';

  const [error,setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sanitizedTitle = dompurify.sanitize(art.title.trim());
    const sanitizedDescription = dompurify.sanitize(art.description.trim());
  
    if (!art.title || art.title.length >  20) {
      setError("Title must be less then 20 characters");
      return;
    }

    if(!art.description || art.description.length <= 30){
      setError("Description must be atleast 30 characters");
      return;
    }
  
    try {
      const form = new FormData();
      form.append("file", art.file!);
      setError("Processing...");
  
      const uploadResponse = await axios.post(`${API_URL}/api/upload`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
    
      const uploadedFileUrl = uploadResponse.data.secure_url;
  
      const postResponse = await axios.post(
        `${API_URL}/api/post`,
        { content: sanitizedTitle, description: sanitizedDescription, file: uploadedFileUrl, category: art.category },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
  
      if (postResponse.status === 201) {
        setArt({ title: "", description: "", category: "", file: null });
        setError(postResponse.data.message);
        setTimeout(() => {
          window.location.reload();
        },2000);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "An error occurred");
      console.error(error);
    }
  };
  


  return (
    <>
     <Helmet>
        <title>Create Post</title>
        <meta name="description" content="Join Art Review to share and review artwork with our creative community"/>
        <meta name="keywords" content="art review, art community, artwork sharing"/>
     </Helmet>
     <div className="flex md:justify-end justify-center mb-4">
  <button
    onClick={() => setShowModal(true)}
    className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 font-medium shadow-md"
  >
    + Create Post
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

      <section aria-label="create post" className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Share Your Art
        </h1>
        <form
          className="w-full space-y-6"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          method="post"
        >
          <div className="text-left">
            <label htmlFor="Category" className="block text-lg font-medium text-gray-700 mb-1">
            Category
            </label>
            <select name="Category" id="Category" onChange={(e) => setArt({ ...art, category: e.target.value })} value={art.category} required>
              <option value="" disabled selected >Choose Category</option>
              <option value="Painting">Painting</option>
              <option value="Sculpture">Music</option>
              <option value="Dance">Dance</option>
              <option value="Photography">Sports</option>
              <option value="Digital Art">Digital Art</option>
            
            </select>
          </div>

          <div className="text-left">
            <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-1">
              Artwork Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="e.g., Sunset Overdrive"
              value={art.title}
              onChange={(e) => setArt({ ...art, title: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="text-left">
            <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-1">
              About Your Artwork
            </label>
            <textarea
              id="description"
              placeholder="Describe your art inspiration, style, or story..."
              value={art.description}
              onChange={(e) => setArt({ ...art, description: e.target.value })}
              required
              rows={4}
              className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="text-left">
            <label htmlFor="file" className="block text-lg font-medium text-gray-700 mb-1">
              Upload Your Artwork
            </label>
            <input
              type="file"
              id="file"
              name="file"
              alt={art.title}
              onChange={(e) => setArt({ ...art, file: e.target.files![0] })}
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

          {error && (
            <p className={`text-sm text-center ${error.includes('Successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {error}
            </p>
          )}
        </form>
      </section>
    </div>
  </div>
)}
</>
  );
}
