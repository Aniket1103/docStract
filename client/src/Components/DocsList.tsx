import axios from 'axios';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface Document {
  _id: string;
  originalName: string;
  key: string;
  url: string;
  extractedData: Object;
}

interface Props {
  setExtractedData: Dispatch<SetStateAction<Object>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const DocsList: React.FC<Props> = ({setExtractedData, setIsModalOpen}: Props) => {
  const [docsList, setDocsList] = useState<Document[]>([]);

  const fetchDocuments = async () => {
    try {
      const { data } = await axios.get<Document[]>(`${import.meta.env.VITE_BASEURL}/document/all`);
      setDocsList(data); 
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleDocumentDataView = (extractedData: Object) => {
    setIsModalOpen(true);
    setExtractedData(extractedData)
  }

  useEffect(() => {
    fetchDocuments();
  }, []); 

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full">
      <h2 className="text-2xl font-bold mb-4">Documents List</h2>
      <ul className="space-y-4 w-4/5 min-w-96">
        {docsList && docsList.map((doc) => (
          <li title='View Extracted Data' key={doc._id} className="p-4 border rounded shadow-md w-full cursor-pointer" onClick={() => handleDocumentDataView(doc.extractedData)}>
            <h3 className="font-semibold">{doc.originalName}</h3>
            <a title='View Uploaded Document' href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                <i>
                  View Document
                </i>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocsList;
