import Conversations from "./Conversations";
import Search from "./Search";

const Sidebar = () => {
    return (
        <div className="w-[100%] md:w-1/3 h-full overflow-y-auto bg-gray-800 text-gray-100 p-4 rounded-l-2xl">
            {/* Sidebar Title */}
            <h2 className="text-xl font-bold text-blue-300 mb-6">Chats</h2>
            
            {/* Search Bar */}
            <Search />
            
            {/* Divider */}
            <div className="divider border-b border-gray-600 my-4"></div>

            {/* Conversations List */}
            <Conversations />
        </div>
    );
};

export default Sidebar;
