const Loader = () => {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-6">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-r-4 border-slate-700 border-opacity-50"></div>
        <p className="text-gray-700 text-lg font-medium">Extracting details...</p>
      </div>
    );
  };
  
  export default Loader;
  