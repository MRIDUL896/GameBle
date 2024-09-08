import { IoSearchOutline } from "react-icons/io5";

const Search = () => {
    return (
        <div className="mb-4">
            <form className="flex items-center gap-2 bg-gray-700 p-3 rounded-lg">
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full bg-gray-600 text-gray-100 placeholder-gray-400 p-2 rounded-lg focus:outline-none"
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 p-2 rounded-full transition-colors"
                >
                    <IoSearchOutline className="text-white" />
                </button>
            </form>
        </div>
    );
};

export default Search;
