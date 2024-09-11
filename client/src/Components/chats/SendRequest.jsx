import React, { useState } from 'react';
import api from '../axiosConfig'

const SendRequest = () => {
    const [friendCode, setFriendCode] = useState('');
    const [status, setStatus] = useState('');

    const handleInputChange = (e) => {
        setStatus('');
        setFriendCode(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await api.post('/gameble/sendRequest',{
                friendCode
            }).then((res) => {
                setStatus(res.data.message);
            }).catch((err) => {
                setStatus("Wrong");
                console.log(err);
            })
        }catch(err){
            console.log(err)
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 m-8 bg-gray-950 text-gray-100 font-sans rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">Enter Friend Code</h2>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="friendCode">
                        Friend Code
                    </label>
                    <input
                        type="text"
                        id="friendCode"
                        value={friendCode}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-yellow-700 bg-black leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter your friend's code"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Send
                </button>
                {status === "Wrong" ?
                    <h2 className="text-2xl font-bold mb-4 text-red-600">Wrong Code</h2> : 
                    <h2 className="text-2xl font-bold mb-4 text-blue-300">{status}</h2>
                }
            </form>
        </div>
    );
};

export default SendRequest;
