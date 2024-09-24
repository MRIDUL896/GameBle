import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import api from '../axiosConfig';
import { useSocketContext } from "../../context/SocketContext";

const CurrentChat = () => {
    const { currentChating } = useSelector((state) => state.user);
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const userId = useSelector((state) => state.user.userInfo?.id);
    const [messages, setMessages] = useState([]);
    const { socket } = useSocketContext();

    // WebSocket listener for receiving new messages
    useEffect(() => {
        if (socket) {
            const handleNewMessage = (newMessage) => {
                console.log("socket")
                // Only update if the message belongs to the current chat
                    console.log('hi')
                    setMessages(prevMessages => [...prevMessages, newMessage]);
            };
    
            socket.on("newMessage", handleNewMessage);
    
            return () => {
                socket.off("newMessage", handleNewMessage); // Cleanup listener on unmount
            };
        }
    }, [socket, currentChating]);
    

    // Function to send message
    // Function to send message
    const sendMessage = async () => {
        if (!message.trim()) return; // Prevent sending empty messages

        setSending(true);
        try {
            // Send the message to the server
            const response = await api.post(`/gameble/message/sendMessage/${currentChating}`, {
                message
            });

            // Append the new message to the current chat messages without refetching the whole list
            setMessages(prevMessages => [...prevMessages, response.data]);

            setMessage(''); // Clear input after sending
        } catch (err) {
            console.error("Error sending message:", err);
        } finally {
            setSending(false);
        }
    };

    // Fetch messages for the current chat
    useEffect(() => {
        const changeChat = async () => {
            if (currentChating) {
                try {
                    const response = await api.get(`/gameble/getChats/${currentChating}`);
                    setMessages(response.data.messages); // Update messages state
                } catch (error) {
                    console.error("Error fetching messages:", error);
                }
            }
        };

        changeChat();
    }, [currentChating]);

    return (
        <div className="flex-1 bg-gray-950 text-gray-100 p-6 md:flex flex-col justify-between rounded-r-2xl hidden ">
            <div className="chat-window h-full overflow-y-auto flex flex-col-reverse">
                {messages.length > 0 ? (
                    <ul>
                        {messages.map(msg => (
                            <li key={msg._id} className={`p-2 flex ${userId === msg.senderId?._id ? 'justify-end' : 'justify-start'}`}>
                                {(!msg.senderId) && console.log(msg)

                                }
                                <div className={`flex flex-col rounded-lg p-3 ${userId === msg.senderId?._id ? 'bg-green-600' : 'bg-blue-700'}`}>
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
            <div className="flex items-center p-4 border-t border-gray-600">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 p-2 border border-gray-700 bg-gray-800 rounded-lg"
                    placeholder="Type a message..."
                />
                <button
                    onClick={sendMessage}
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                    disabled={sending}
                >
                    {sending ? 'Sending...' : 'Send'}
                </button>
            </div>
        </div>
    );
};

export default CurrentChat;
