import React from 'react';
import { useSelector } from 'react-redux';

const ProfileCard = () => {
    const { userInfo } = useSelector((state) => state.user);

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
            <div className="flex justify-center">
                <button className="py-2 px-4 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-semibold transition-colors">
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default ProfileCard;