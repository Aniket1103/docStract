import React, { Dispatch, SetStateAction } from 'react';
import { Tabs } from '../App';

type Props = {
  setTab: Dispatch<SetStateAction<string>>;
}

const Navbar: React.FC<Props> = ({setTab}: Props) => {
  return (
    <div className="flex fixed top-0 z-50 w-full h-16 bg-white shadow-md items-center">
      <h1 className="text-3xl text-center text-green-900 font-bold tracking-tighter">
        DocStract
      </h1>
      <div className='flex mx-4 text-lg text-green-800 font-medium'>
        <div className='flex justify-center items-center text-center min-w-14 mx-2 cursor-pointer h-16 border-b-2 border-transparent hover:border-green-700' onClick={() => setTab(Tabs.UPLOAD)}>Upload</div>
        <div className='flex justify-center items-center text-center min-w-14 mx-2 cursor-pointer h-16 border-b-2 border-transparent hover:border-green-700' onClick={() => setTab(Tabs.DOCSLIST)}>Docs</div>
      </div>
    </div>
  );
};

export default Navbar;
