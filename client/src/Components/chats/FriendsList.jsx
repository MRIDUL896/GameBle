import React, { useState, useEffect } from 'react';
import { useDispatch} from 'react-redux';
import api from '../axiosConfig';
import { updateFriends } from '../../store/userSlice';
import Friend from './Friend';

const FriendsList = () => {
    const dispatch = useDispatch();
    const [friendsList, setFriendsList] = useState([]);
    const [loading, setLoading] = useState(true); // To handle loading state
    const [error, setError] = useState(null); // To handle errors

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                await api.get('/gameble/getFriends').then((response) => {
                    setFriendsList(response.data); // assuming response.data holds the array of friends
                    dispatch(updateFriends(response.data))
                    setLoading(false);
                })
            } catch (err) {
                setError(err.message || 'Failed to fetch friends');
            }
        };
        fetchFriends();
    },[dispatch]); // Empty array means this runs once when the component mounts

    if (error) return <div>Error: {error}</div>;

    return (

        <div className="flex flex-col items-center justify-center p-4 m-8 w-[90%] bg-gray-800 text-gray-100 font-sans rounded-lg">
            {
                loading ?
                <h2 className="text-3xl font-bold mb-4 text-center text-blue-300">Loading...</h2> :
                friendsList.length === 0 ?
                <h2 className="text-3xl font-bold mb-4 text-center text-blue-300">No Friends</h2> :
                <h2 className="text-3xl font-bold mb-4 text-center text-blue-300">Your Friends</h2>
            }
            <ul className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-[90%] h-96 md:h-auto p-2 overflow-y-auto">
                {friendsList!==null && friendsList.map((friend) => (
                    <Friend friend={friend} key={friend._id}/>
                ))}
            </ul>
        </div>
    );
};

export default FriendsList;
