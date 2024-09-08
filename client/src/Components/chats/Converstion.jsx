const Conversation = () => {
    return (
        <div className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer flex items-center space-x-3">
            {/* Avatar */}
            <div className="bg-gray-500 rounded-full w-12 h-12"></div>

            {/* Conversation Info */}
            <div>
                <h3 className="font-semibold text-blue-200">Friend Name</h3>
                <p className="text-gray-400 text-sm">Last message preview...</p>
            </div>
        </div>
    );
};

export default Conversation;
