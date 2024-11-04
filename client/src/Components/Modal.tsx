import React, { Dispatch, SetStateAction } from 'react';
import { IoClose } from 'react-icons/io5';
import Loader from './Loader';

type Props = {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  extractedData: Object
}

const Modal: React.FC<Props> = ({setIsModalOpen, isLoading, extractedData}: Props) => {
  return (
    <div className="fixed flex justify-center items-center inset-0 h-full w-full bg-black bg-opacity-50 z-20">
      <div className="bg-white w-4/5 min-w-80 max-h-96 rounded-lg z-20 flex flex-col">
        <div className="flex justify-end bg-white h-7 rounded-lg">
          <button className="p-1 mx-1" onClick={() => setIsModalOpen(false)}>
            <IoClose />
          </button>
        </div>
        <div className="bg-black bg-opacity-5 flex-grow overflow-y-auto">
          {isLoading && <Loader />}
          <div className="p-10 overflow-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white border border-gray-300">
              <tbody>
                {!isLoading && Object.entries(extractedData).map(([key, value]) => (
                  <tr key={key} className="border-b border-gray-300">
                    <td className="px-4 py-2 text-gray-600 font-semibold bg-gray-100">
                      {key}
                    </td>
                    <td className="px-4 py-2 text-gray-800">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
