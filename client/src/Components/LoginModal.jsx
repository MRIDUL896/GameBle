import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/userSlice';
import api from './axiosConfig'

const LoginModal = ({ onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const dispatch = useDispatch();

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (isLogin) {
                // Handle login
                response = await api.post('/gameble/login', {
                    email,
                    password
                });
                const { token } = response.data;
                console.log(response.data)
                console.log(token)
                const jwt = getCookie('jwt');
                console.log('JWT Cookie:', jwt);
                dispatch(login(response.data.user));
                onClose();
            } else {
                // Handle signup
                response = await api.post('/gameble/signup', {
                    name,
                    email,
                    password,
                    phoneNo
                });
                alert('Signup successful! Please log in.');
                setIsLogin(true);
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                alert(error.response.data.message || 'An error occurred');
            } else if (error.request) {
                // The request was made but no response was received
                alert('No response from server. Please try again.');
            } else {
                // Something happened in setting up the request that triggered an Error
                alert('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg w-96">
                <h2 className="text-2xl mb-4">{isLogin ? 'Login' : 'Sign Up'}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {!isLogin && (
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setname(e.target.value)}
                            placeholder="Name"
                            className="p-2 border rounded"
                            required
                        />
                    )}
                    {!isLogin && (
                        <input
                            type="text"
                            value={phoneNo}
                            onChange={(e) => setPhoneNo(e.target.value)}
                            placeholder="PhoneNo"
                            className="p-2 border rounded"
                            required
                        />
                    )}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="p-2 border rounded"
                        required
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>
                <p className="mt-4 text-center">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-2 text-blue-500 hover:underline"
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginModal;