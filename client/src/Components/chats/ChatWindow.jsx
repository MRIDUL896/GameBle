import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from '../axiosConfig';
import { useSocketContext } from "../../context/SocketContext";

const ChatWindow = () => {
    const userId = useSelector((state) => state.user.userInfo?.id);
    const { currentChating } = useSelector((state) => state.user);
    const [messages, setMessages] = useState([]);
    const { socket } = useSocketContext();

    // Fetch the chat messages whenever the current chat changes
    useEffect(() => {
        const changeChat = async () => {
            if (currentChating) {
                try {
                    const response = await api.get(`/gameble/getChats/${currentChating}`);
                    setMessages(response.data.messages);  // Update messages state
                } catch (error) {
                    console.error("Error fetching messages:", error);
                }
            }
        };

        changeChat();
    }, [currentChating]);

    // Handle incoming new messages via socket
    useEffect(() => {
        if (socket) {
            const handleNewMessage = (newMessage) => {
                setMessages(prevMessages => [...prevMessages, newMessage]);
            };

            socket.on("newMessage", handleNewMessage);

            return () => {
                socket.off("newMessage", handleNewMessage);
            };
        }
    }, [socket]);

    return (
        <div className="chat-window h-full overflow-y-auto">
            {messages.length > 0 ? (
                <ul>
                    {messages.map(msg => (
                        <li key={msg._id} className={`p-2 flex ${userId === msg.senderId._id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex flex-col rounded-lg p-3 ${userId === msg.senderId._id ? 'bg-green-600' : 'bg-blue-700'}`}>
                                <div>{msg.message}</div>
                                <div className="text-gray-400 text-sm">
                                    {new Date(msg.createdAt).toLocaleString()}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No messages to display</p>
            )}
        </div>
    );
};

export default ChatWindow;
