import React, { useState } from "react";
import "./index.css";

function App() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/download?url=${url}&title=${title}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const fileBlob = await response.blob();
      const downloadUrl = URL.createObjectURL(fileBlob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${title}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-900">Download Video</h1>
      <form className="mt-8" onSubmit={handleFormSubmit}>
        <div className="flex flex-col mb-4">
          <label htmlFor="url" className="mb-2 font-bold text-gray-900">
            Video URL
          </label>
          <input
            type="text"
            name="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="title" className="mb-2 font-bold text-gray-900">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>
        <button type="submit" className="btn btn-outline btn-success">
          Download
        </button>
      </form>
      {isLoading && (
        <p className="text-blue-500 mt-2">
          Please wait while the file is downloaded...
        </p>
      )}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
}

export default App;
