import { useState, useEffect } from 'react';
import api from '../axiosConfig';
import { useDispatch } from 'react-redux';
import { updateCurrentChating } from '../../store/userSlice';

const Conversations = () => {
    // const {currentChating} = useSelector((state) => state.user);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const formatDate = (dateString) => {
        if (!dateString) return "No date available";
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    const handleChatClick = (conversationId) => {
        dispatch(updateCurrentChating(conversationId));
    }

    useEffect(() => {
        const getConvo = async () => {
            setLoading(true);
            const convos = await api.get('/gameble/getFriends');
            setConversations(convos.data);
            setLoading(false);
        }
        getConvo();
    }, [])

    if (loading) return <p>Loading conversations...</p>;

    return (
        <div className="space-y-3 ">
            {conversations.map((conversation, index) => (
                <div
                    key={conversation ? conversation._id : index}
                    className="p-4 bg-gray-950 hover:bg-gray-600 rounded-lg cursor-pointer flex items-center space-x-3"
                    onClick={() => handleChatClick(conversation._id)}>
                    <div className="bg-gray-500 rounded-full w-12 h-12"></div>
                    <div>
                        <h3 className="font-semibold text-blue-200">{conversation.name}</h3>
                        <p className="text-gray-400 text-sm">
                            {conversation.latestMessage ? formatDate(conversation.latestMessage.createdAt) : "No messages yet"}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Conversations;
