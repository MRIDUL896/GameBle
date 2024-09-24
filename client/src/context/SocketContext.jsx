import { createContext ,useState, useEffect, useContext} from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";

export const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
}

export const SocketContextProvider = ({ children }) => {

    const [socket,setSocket] = useState(null);
    const [onlineUsers,setOnlineUsers] = useState([]);
    const {userInfo} = useSelector((state) => state.user);

    useEffect(() => {
        if(userInfo){
            const socket = io("https://gameable.onrender.com",{
                query:{
                    userId : userInfo?.id
                }
            });

            setSocket(socket);

            socket.on("getOnlineUsers",(users) => {
                setOnlineUsers(users)
            })

            return () => socket.close();
        }else{
            if(socket){
                socket.close();
                setSocket(null);
            }
        }
    },[userInfo])


    return (
        <SocketContext.Provider value={{socket,onlineUsers}}>
            {children}
        </SocketContext.Provider>
    )
}