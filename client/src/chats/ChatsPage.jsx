import React from 'react';
import { useSelector } from 'react-redux';
import { FaUserFriends, FaPaperPlane, FaEnvelopeOpenText, FaUserPlus } from 'react-icons/fa';

const ChatsPage = () => {
    const { friends = [], incomingFriendRequests = [], pendingFriendRequests = [], chats = [] } = useSelector((state) => state.user);

    return (
        <div className="flex flex-col items-center justify-center p-4 m-8 w-[90%] bg-gray-800 text-gray-100 font-sans rounded-lg">
            <h2 className="text-3xl font-bold mb-4 text-center text-blue-300">Chat Dashboard</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-[90%]">
                
                {/* Chats Section */}
                <div className="bg-gray-700 hover:bg-gray-600 transition-colors rounded-lg p-4 text-center">
                    <h3 className="text-xl text-blue-200 mb-2">Chats</h3>
                    <FaEnvelopeOpenText className="mx-auto mb-2 text-blue-400" size={32} />
                    {chats.length > 0 ? (
                        <p className="text-gray-300">See Chats</p>
                    ) : (
                        <p className="text-gray-300">No active chats</p>
                    )}
                </div>

                {/* Friends Section */}
                <div className="bg-gray-700 hover:bg-gray-600 transition-colors rounded-lg p-4 text-center">
                    <h3 className="text-xl text-blue-200 mb-2">Friends</h3>
                    <FaUserFriends className="mx-auto mb-2 text-green-400" size={32} />
                    {friends.length > 0 ? (
                        <p className="text-gray-300">See friends</p>
                    ) : (
                        <p className="text-gray-300">No friends found</p>
                    )}
                </div>

                {/* Incoming Friend Requests Section */}
                <div className="bg-gray-700 hover:bg-gray-600 transition-colors rounded-lg p-4 text-center">
                    <h3 className="text-xl text-blue-200 mb-2">Incoming Friend Requests</h3>
                    <FaUserPlus className="mx-auto mb-2 text-yellow-400" size={32} />
                    {incomingFriendRequests.length > 0 ? (
                        <p className="text-gray-300">See incoming friend requests</p>
                    ) : (
                        <p className="text-gray-300">No incoming friend requests</p>
                    )}
                </div>

                {/* Pending Friend Requests Section */}
                <div className="bg-gray-700 hover:bg-gray-600 transition-colors rounded-lg p-4 text-center">
                    <h3 className="text-xl text-blue-200 mb-2">Pending Friend Requests</h3>
                    <FaPaperPlane className="mx-auto mb-2 text-red-400" size={32} />
                    {pendingFriendRequests.length > 0 ? (
                        <p className="text-gray-300">See pending friend requests</p>
                    ) : (
                        <p className="text-gray-300">No pending friend requests</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ChatsPage;
