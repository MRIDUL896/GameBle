import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaUserFriends, FaPaperPlane, FaEnvelopeOpenText, FaUserPlus } from 'react-icons/fa';
import FriendsList from './FriendsList';
import ChatsHome from './ChatsHome';
import IncomingRequests from './IncomingRequests';
import PendingRequests from './PendingRequests';
import SendRequest from './SendRequest';

const ChatsPage = () => {

    const [curr,setCurr] = useState('');

    const handleClick = (val) => {
        if(val === curr) setCurr('')
        else setCurr(val);
    }

    const userInfo = useSelector((state) => state.user?.userInfo || {});
    const {
        friends = [],
        incomingFriendRequests = [],
        pendingFriendRequests = [],
        chats = []
    } = userInfo;

    return (
        <div className="flex flex-col items-center justify-center p-4 m-8 w-[90%] bg-gray-800 text-gray-100 font-sans rounded-lg">
            <h2 className="text-3xl font-bold mb-4 text-center text-blue-300">Chat Dashboard</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 w-[90%]">
                
                {/* Chats Section */}
                <div className="flex flex-col justify-center items-center bg-gray-950 cursor-pointer hover:bg-gray-600 rounded-lg p-4 text-center transition-transform duration-300 hover:scale-105"
                onClick={() => handleClick("Chats")}>
                    <h3 className="text-xl text-blue-200 mb-2">Chats</h3>
                    <FaEnvelopeOpenText className="mx-auto mb-2 text-blue-400" size={32} />
                    {chats.length > 0 ? (
                        <p className="text-gray-300">See Chats</p>
                    ) : (
                        <p className="text-gray-300">No active chats</p>
                    )}
                </div>

                {/* Friends Section */}
                <div className="flex flex-col justify-center items-center bg-gray-950 cursor-pointer hover:bg-gray-600 rounded-lg p-4 text-center transition-transform duration-300 hover:scale-105"
                onClick={() => handleClick("Friends")}>
                    <h3 className="text-xl text-blue-200 mb-2">Friends</h3>
                    <FaUserFriends className="mx-auto mb-2 text-green-400" size={32} />
                    {friends!==null  && friends.length > 0 ? (
                        <p className="text-gray-300">See friends</p>
                    ) : (
                        <p className="text-gray-300">No friends found</p>
                    )}
                </div>

                {/* Incoming Friend Requests Section */}
                <div className="flex flex-col justify-center items-center bg-gray-950 cursor-pointer hover:bg-gray-600 transition-transform duration-300 hover:scale-105 rounded-lg p-4 text-center"
                onClick={() => handleClick("Incoming")}>
                    <h3 className="text-xl text-blue-200 mb-2">Incoming Friend Requests</h3>
                    <FaUserPlus className="mx-auto mb-2 text-yellow-400" size={32} />
                    {incomingFriendRequests.length > 0 ? (
                        <p className="text-gray-300">See incoming friend requests</p>
                    ) : (
                        <p className="text-gray-300">No incoming friend requests</p>
                    )}
                </div>

                {/* Send Friend Requests Section */}
                <div className= "flex flex-col justify-center items-center cursor-pointer bg-gray-950 hover:bg-gray-600 transition-transform duration-300 hover:scale-105 rounded-lg p-4 text-center"
                onClick={() => handleClick("SendReq")}>
                    <h3 className="text-xl text-blue-200 mb-2">Send Friend Requests</h3>
                    <FaPaperPlane className="mx-auto mb-2 text-red-400" size={32} />
                </div>

                {/* Your Pending Requests */}
                <div className="bg-gray-950 cursor-pointer hover:bg-gray-600 rounded-lg p-4 text-center transition-transform duration-300 hover:scale-105"
                onClick={() => handleClick("Pending")}>
                    <h3 className="text-xl text-blue-200 mb-2">Pending Requests</h3>
                    <FaEnvelopeOpenText className="mx-auto mb-2 text-blue-400" size={32} />
                    {pendingFriendRequests.length > 0 ? (
                        <p className="text-gray-300">See Your Pending Requests</p>
                    ) : (
                        <p className="text-gray-300">No active pending requests</p>
                    )}
                </div>

            </div>
            {curr === "Friends" && <FriendsList/>}
            {curr === "Chats" && <ChatsHome/>}
            {curr === "Incoming" && <IncomingRequests/>}
            {curr === "Pending" && <PendingRequests/>}
            {curr === "SendReq" && <SendRequest/>}
        </div>
    );
};

export default ChatsPage;
