import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from './axiosConfig'

const Profile = () => {
    const {userInfoId} = useParams();
    const [userInfo,setUserInfo] = useState(null);

    useEffect(() => {
        const getInfo = async () => {
            await api.get(`/gameble/getUserInfo/${userInfoId}`).then((res) =>{
                console.log(res.data)
                setUserInfo(res.data);
            }).catch((err) => {
                console.log(err);
            })
        } 
        getInfo();
    },[])

    return (
        <div className="flex flex-col items-center mb-8 max-w-md mx-auto p-6 bg-gray-800 text-gray-100 rounded-lg shadow-lg">
            <div className="flex items-center justify-center mb-4">
                <img
                    src={userInfo?.profilePicture || 'https://png.pngtree.com/thumb_back/fh260/background/20230712/pngtree-3d-rendering-of-online-sports-betting-concept-image_3831784.jpg'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-gray-700"
                />
            </div>
            <h2 className="text-2xl font-bold text-center text-blue-300 mb-2">
                {userInfo?.name || 'User Name'}
            </h2>
            <p className="text-center text-gray-400 mb-4">
                {userInfo?.email || 'user@example.com'}
            </p>
            <p className="text-black mb-4 bg-yellow-500 p-2 rounded-xl border-2 border-red-400">
                <span className='text-green-700'>Code : </span> {userInfo?.friendCode || 'Code'}
            </p>
        </div>
    )
}

export default Profile;