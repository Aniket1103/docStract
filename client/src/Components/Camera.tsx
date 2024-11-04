import React, { useRef, useState, useCallback, ChangeEvent, Dispatch, SetStateAction } from "react";
import Webcam from "react-webcam";
import axios from "axios";

type Prop = {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setExtractedData: Dispatch<SetStateAction<Object>>;
}

const Camera: React.FC<Prop> = ({setIsLoading, setIsModalOpen, setExtractedData}: Prop) => {
  const webcamRef = useRef<Webcam>(null);
  const [isCaptureMode, setIsCaptureMode] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc || null);
    }
  }, [webcamRef]);

  const base64ToBlob = (base64: string): Blob => {
    const byteString = atob(base64.split(",")[1]);
    const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };


  const handleUpload = async () => {
    if (
      (isCaptureMode && !capturedImage) ||
      (!isCaptureMode && !selectedFile)
    ) {
      if (isCaptureMode) return alert("Need to capture the image.");
      else return alert("Need to upload the file.");
    }
    setIsModalOpen(true);
    setIsLoading(true);
    const formData = new FormData();
    if (isCaptureMode) {
      const blob = base64ToBlob(capturedImage as string);
      formData.append("image", blob, "captured-image.jpg"); // Append the blob to the FormData
    } else {
      if (selectedFile) {
        const OriginalFileName = selectedFile.name;
        formData.append("image", selectedFile, OriginalFileName);
      }
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASEURL}/document/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Image uploaded successfully:", response.data);
      setExtractedData(response.data.data);
    } catch (error) {
      setIsModalOpen(false);
      console.error("Error uploading image:", error);
      alert("Error while Extracting Data, Please try again.")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center m-1">
      <button
        onClick={() => setIsCaptureMode(!isCaptureMode)}
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded mb-4"
      >
        {isCaptureMode ? "Switch to File Upload" : "Switch to Capture"}
      </button>
      { isCaptureMode && 
        <div className="text-gray-600 mb-2">
          Hold your Identity card, in front of the webcam <br/>(e.g. Passport, Driving License)
        </div>
      }
      {isCaptureMode ? (
        !capturedImage ? (
          <>
            <div className="bg-slate-300 rounded-md w-96">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                width="100%"
                className="h-full rounded-lg shadow-lg"
              />
            </div>
            <div className="flex justify-center items-center">
              <button
                onClick={capture}
                className="px-5 py-2.5 my-2 mx-auto bg-indigo-500 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition duration-150"
              >
                Capture
              </button>
            </div>
          </>
        ) : (
          <>
            <img
              src={capturedImage}
              alt="Captured"
              style={{ width: "100%" }}
              className="w-full rounded-lg shadow-lg"
            />
            <div className="flex justify-center items-center">
              <button
                onClick={() => setCapturedImage(null)}
                className="px-5 py-2.5 m-2 bg-gray-500 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-150"
              >
                Retake
              </button>
            </div>
          </>
        )
      ) : (
        <input type="file" accept="image/*" onChange={handleFileChange} />
      )}
      <button
        onClick={handleUpload}
        className="px-5 py-2.5 my-2  bg-emerald-500 text-white font-semibold rounded-lg shadow-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition duration-150"
      >
        Upload
      </button>
    </div>
  );
};

export default Camera;
