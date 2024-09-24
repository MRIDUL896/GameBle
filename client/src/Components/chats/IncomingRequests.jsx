import { useState,useEffect } from "react";
import api from '../axiosConfig'
import { useSocketContext } from "../../context/SocketContext";

const IncomingRequests = () => {
    const [reqList, setReqList] = useState([]);
    const [loading, setLoading] = useState(true);
    const {socket} = useSocketContext();


    const handleAccept = async (id) => {
        await api.post('/gameble/acceptRequest',{
            id
        }).then(() => {
            setReqList(reqList.filter(req => req._id !== id))
        }).catch((err) => {
            console.log("an error",err)
        })
    }

    useEffect(() => {
        if(socket){
            const handleNewReq = (newRequest) => {
                console.log("inside")
                const newReq = async () => {
                    try {
                        const response = await api.get('/gameble/getRequests');
                        console.log(response.data)
                        setReqList(response.data); // assuming response.data holds the array of friends
                    } catch (err) {
                        console.log(err);
                    } finally {
                        setLoading(false);
                    }
                };
                newReq();
            }
            socket.on('newRequest',handleNewReq);
            return () => {
                socket.off("newRequest",handleNewReq)
            } 
        }
    },[socket])

    useEffect(() => {
        const fetchReq = async () => {
            try {
                const response = await api.get('/gameble/getRequests');
                setReqList(response.data); // assuming response.data holds the array of friends
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReq();
    },[]);

    return (
        <div className="flex flex-col items-center justify-center p-4 m-8 w-[90%] bg-gray-800 text-gray-100 font-sans rounded-lg">
            {
                loading ?
                <h2 className="text-3xl font-bold mb-4 text-center text-blue-300">Loading...</h2> :
                reqList.length === 0 ?
                <h2 className="text-3xl font-bold mb-4 text-center text-blue-300">No friend requests</h2> :
                <h2 className="text-3xl font-bold mb-4 text-center text-blue-300">Incoming Requests</h2>
            }
            <ul className="grid grid-cols-2 p-2 md:grid-cols-3 gap-4 w-[90%] h-96 md:h-auto overflow-y-auto">
                {reqList.map((friend, index) => (
                    <li
                        key={index}
                        className="flex flex-col bg-gray-950 hover:bg-gray-600 transition-colors rounded-lg p-4 text-center cursor-pointer ring-2 ring-transparent hover:ring-blue-400"
                    >
                        <div className="flex items-center justify-center mb-4">
                            <img
                                src={friend?.profilePicture || 'https://png.pngtree.com/thumb_back/fh260/background/20230712/pngtree-3d-rendering-of-online-sports-betting-concept-image_3831784.jpg'}
                                alt="Profile"
                                className="w-10 h-10 md:w-16 md:h-16 rounded-full border-4 border-gray-700"
                            />
                        </div>
                        <div>
                            <h3 className="text-lg text-blue-200 mb-2">{friend.name}</h3>
                            <p className="text-sm text-gray-300 hidden md:block">Click to view profile</p>
                            <button className="bg-green-700 hover:bg-green-500 rounded-xl p-2 m-1"
                            onClick={() => handleAccept(friend._id)}>Accept</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default IncomingRequests;