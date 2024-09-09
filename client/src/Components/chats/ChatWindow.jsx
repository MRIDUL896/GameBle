import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from '../axiosConfig'

const ChatWindow = ( ) => {
    const {currentChating} = useSelector((state) => state.user);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const changeChat = async () => {
            if (currentChating) {
                try {
                    const response = await api.get(`/gameble/message/getMessage/${currentChating}`);
                    setMessages(response.data);  // Update messages state
                    console.log(messages)
                } catch (error) {
                    console.error("Error fetching messages:", error);
                }
            }
        };
        
        changeChat();
    },[]);

    return (
        <div className="chat-window h-full overflow-y-auto">
            {messages.length > 0 ? (
                <ul>
                    {messages.map(msg => (
                        <li key={msg._id} className="p-2">
                            <p>
                                <strong>{msg.senderId.name}:</strong> {msg.message}
                            </p>
                            <span className="text-gray-400 text-sm">
                                {new Date(msg.createdAt).toLocaleString()}
                            </span>
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
