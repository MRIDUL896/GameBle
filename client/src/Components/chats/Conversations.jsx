import { useState, useEffect } from 'react';
import api from '../axiosConfig';
import { useDispatch,useSelector } from 'react-redux';
import { updateCurrentChating } from '../../store/userSlice';

const Conversations = () => {
    const {currentChating} = useSelector((state) => state.user);
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
        if(conversationId === currentChating)  dispatch(updateCurrentChating(""))
        dispatch(updateCurrentChating(conversationId));
    }

    useEffect(() => {
        const getConvo = async () => {
            setLoading(true);
            await api.get('/gameble/getConversations').then((convos) => {
                setConversations(convos.data);
                setLoading(false);
            }).catch((err) =>{
                console.log(err)
            });
        }
        getConvo();
    }, [])

    if (loading) return <p>Loading conversations...</p>;

    return (
        <div className="space-y-3 ">
            {conversations.map((conversation, index) => (
                <div
                    key={conversation ? conversation.conversationId : index}
                    className={`p-4 hover:bg-gray-600 rounded-lg cursor-pointer flex items-center space-x-3
                    ${currentChating === conversation.conversationId ? "bg-gray-600" : " bg-gray-950"}`}
                    onClick={() => handleChatClick(conversation.conversationId)}>
                    <div className="bg-gray-500 rounded-full w-12 h-12"></div>
                    <div>
                        <h3 className="font-semibold text-blue-200">{conversation.otherUser}</h3>
                        <span>{formatDate(conversation.updatedAt)}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Conversations;
