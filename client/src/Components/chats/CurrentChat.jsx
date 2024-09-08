import { useState } from 'react';
import ChatWindow from './ChatWindow';

const CurrentChat = ({ selectedConversationId }) => {
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    const sendMessage = async () => {
        
    };

    return (
        <div className="flex-1 bg-gray-900 text-gray-100 p-6 md:flex flex-col justify-between rounded-r-2xl hidden ">
            <ChatWindow selectedConversationId={selectedConversationId} />
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
