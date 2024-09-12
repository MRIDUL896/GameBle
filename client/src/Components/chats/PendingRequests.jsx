import { useState,useEffect } from "react";
import { useDispatch} from 'react-redux';
import api from '../axiosConfig'
import { updatePendingFriendRequests } from "../../store/userSlice";


const PendingRequests = () => {
    const [reqList, setReqList] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchReq = async () => {
            setLoading(true);
            try {
                await api.get('/gameble/getPendingRequests').then((response) => {
                    setReqList(response.data);
                    dispatch(updatePendingFriendRequests(response.data));
                    setLoading(false);
                })
            } catch (err) {
                console.log(err.message || 'Failed to fetch friends');
            }
        };
        fetchReq();
    },[dispatch]);

    return (
        <div className="flex flex-col items-center justify-center p-4 m-8 w-[90%] bg-gray-800 text-gray-100 font-sans rounded-lg">
            {
                loading ? 
                <h2 className="text-3xl font-bold mb-4 text-center text-blue-300">Loading...</h2> :
                reqList.length === 0 ?
                <h2 className="text-3xl font-bold mb-4 text-center text-blue-300">No pending requests</h2> : 
                <h2 className="text-3xl font-bold mb-4 text-center text-blue-300">Your pending requests</h2>
            }
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-[90%]">
                {reqList.map((friend, index) => (
                    <li
                        key={index}
                        className="flex bg-gray-950 hover:bg-gray-600 transition-colors rounded-lg p-4 text-center cursor-pointer ring-2 ring-transparent hover:ring-blue-400"
                    >
                        <div className="flex items-center justify-center mb-4">
                            <img
                                src={friend?.profilePicture || 'https://png.pngtree.com/thumb_back/fh260/background/20230712/pngtree-3d-rendering-of-online-sports-betting-concept-image_3831784.jpg'}
                                alt="Profile"
                                className="w-16 h-16 rounded-full border-4 border-gray-700"
                            />
                        </div>
                        <div>
                            <h3 className="text-lg text-blue-200 mb-2">{friend.name}</h3>
                            <p className="text-sm text-gray-300">Click to view profile</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default PendingRequests;