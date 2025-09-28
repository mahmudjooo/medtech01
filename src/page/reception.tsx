import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";

const Reception = () => {
  return (
    <div className="w-[90%] mx-auto h-full grid grid-cols-4">
      <div className="w-full h-full col-span-1">
        <Sidebar />
      </div>
      <div className="col-span-3">
        <Navbar />
      </div>
    </div>
  );
};

export default Reception;
