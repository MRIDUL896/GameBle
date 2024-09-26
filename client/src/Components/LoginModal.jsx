import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/userSlice';
import api from './axiosConfig'
import CookieConsent from "react-cookie-consent"

const LoginModal = ({ onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [inProcess, setInProcess] = useState(false);
    const dispatch = useDispatch();

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setInProcess(true);
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
                setInProcess(false);
                onClose();
            } else {
                // Handle signup
                setInProcess(true)
                response = await api.post('/gameble/signup', {
                    name,
                    email,
                    password,
                    phoneNo
                });
                setInProcess(true);
                alert('Signup successful! Please log in.');
                setIsLogin(true);
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                alert(error.response.data.message || 'An error occurred');
                setInProcess(false);
            } else if (error.request) {
                // The request was made but no response was received
                alert('No response from server. Please try again.');
                setInProcess(false);
            } else {
                // Something happened in setting up the request that triggered an Error
                alert('An error occurred. Please try again.');
                setInProcess(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-8 rounded-lg w-96">
                <h2 className="text-2xl mb-4 font-bold text-white">{isLogin ? 'Login' : 'Sign Up'}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-white">
                    {!isLogin && (
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setname(e.target.value)}
                            placeholder="Name"
                            className="p-2 border rounded bg-gray-800"
                            required
                        />
                    )}
                    {!isLogin && (
                        <input
                            type="text"
                            value={phoneNo}
                            onChange={(e) => setPhoneNo(e.target.value)}
                            placeholder="PhoneNo"
                            className="p-2 border rounded bg-gray-800"
                            required
                        />
                    )}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="p-2 border rounded bg-gray-800"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="p-2 border rounded bg-gray-800"
                        required
                    />
                    <button type="submit" className={`${inProcess ? "hidden" : "block"} bg-blue-500 text-white p-2 rounded hover:bg-blue-600`}>
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                    <div className='flex items-center justify-center'>
                        <div className={`${inProcess ? "block" : "hidden"} flex flex-row items-center justify-center status`}>
                            <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span class="sr-only">Loading...</span>
                            <span>This might take some time due to delayed server response. Please wait for 50 seconds.</span>
                        </div>
                    </div>
                </form>
                <p className="mt-4 text-center text-white">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-2 text-blue-500 hover:underline"
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
            <CookieConsent
                location="bottom"
                buttonText="Accept"
                cookieName="myAppCookieConsent"
                style={{ background: "#2B373B" }}
                buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
                expires={150}
            >
                This website uses cookies to enhance the user experience.{" "}
                <a href="/privacy-policy" style={{ color: "yellow" }}>Learn more</a>
            </CookieConsent>
        </div>
    );
};

export default LoginModal;