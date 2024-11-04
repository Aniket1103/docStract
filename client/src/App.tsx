import { useEffect, useState } from 'react';
import './App.css'
import Camera from './Components/Camera'
import Modal from './Components/Modal'
import Navbar from './Components/Navbar'
import DocsList from './Components/DocsList';

export const Tabs = {
  UPLOAD: 'UPLOAD',
  DOCSLIST: 'DOCSLIST'
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<Object>({});
  const [tab, setTab] = useState(Tabs.UPLOAD);

  useEffect(() => {
    console.log(tab);
  }, [tab])

  return (
    <>
      <Navbar setTab={setTab}/>
      <div className='flex flex-col mt-20 justify-center items-center m-auto'>
        {isModalOpen && <Modal setIsModalOpen={setIsModalOpen} isLoading={isLoading} extractedData={extractedData}/>}
        { 
          tab === Tabs.UPLOAD &&
          <Camera setIsLoading={setIsLoading} setIsModalOpen={setIsModalOpen} setExtractedData={setExtractedData}/>
        }
        { 
          tab === Tabs.DOCSLIST &&
          <DocsList setExtractedData={setExtractedData} setIsModalOpen={setIsModalOpen} />
        }
      </div>
    </>
  )
}

export default App
