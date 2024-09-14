import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client"
import userAtom from "../atoms/userAtom";


export const useSocket = () =>{
    return useContext(SocketContext)
}
const SocketContext = createContext();

export const SocketContextProvider = ({children})=>{
    const [socket, setSocket] = useState(null);
    const user = useRecoilValue(userAtom)
    const [onlineUsers, setOnlineUsers] = useState([])

    useEffect(()=>{
        const socket = io("/",{
            query:{
                userId:user?._id
            }
        });

        setSocket(socket);

        socket.on("getOnlineUsers", (users)=>{
            setOnlineUsers(users)
        })

        return ()=> socket && socket.close();
    },[user?._id ])
    
    console.log(onlineUsers, "Online User");
    return (
        <SocketContext.Provider value={{socket, onlineUsers}}>
            {children}
        </SocketContext.Provider>
    )
}