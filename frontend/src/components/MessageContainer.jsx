import { Flex, Avatar, useColorModeValue, Text, Image, Divider, SkeletonCircle, Skeleton } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import Message from './Message.jsx'
import MessageInput from './MessageInput.jsx'
import useShowToast from '../hooks/useShowToast.js'
import { conversationAtom, selectedConversationAtom } from '../atoms/messageAtom.jsx'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom.jsx'
import { useSocket } from '../context/SocketContext.jsx'
import messageSound from "../assets/sounds/message.mp3"

const MessageContainer = () => {
    const showToast = useShowToast()
    const selectedConversation = useRecoilValue(selectedConversationAtom)
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [messages, setMessages] = useState([]);
    const curUser = useRecoilValue(userAtom)
    const {socket} = useSocket()
    const setConversations= useSetRecoilState(conversationAtom)
    
    // for scroling
    const messageEndRef = useRef(null)

    useEffect(()=>{
        messageEndRef.current?.scrollIntoView({behavior:"smooth"})
    },[messages])

    useEffect(()=>{
        socket.on("newMessage",(message)=>{
            if(selectedConversation._id === message.conversationId){
                setMessages((prevMessages)=>[...prevMessages, message]);
            }

            if(document.hasFocus()){
                const sound = new Audio(messageSound);
                sound.play()
            }

            setConversations((prev)=>{
                const updated = prev.map(conversation=>{
                    if(conversation._id === message.conversationId ){
                        return {
                            ...conversation,
                            lastMessage:{
                                text: message.text,
                                sender: message.sender,
                            }
                        }
                    }
                    return conversation
                })
                return updated
            })
        })

        return ()=>socket.off("newMessage")
    },[socket, selectedConversation, setConversations])

    useEffect(()=>{
        const lastMessageIsFromOtherUser = messages.length && messages[messages.length-1].sender !== curUser._id
        if(lastMessageIsFromOtherUser){
            socket.emit("markMessageAsSeen",{
                conversationId: selectedConversation._id,
                userId: selectedConversation.userId,
            })
        } 
    
        socket.on("messagesSeen", ({conversationId})=>{
            if(selectedConversation._id === conversationId){
                setMessages(prev =>{
                    const updatedMessages = prev.map(message => {
                        if(!message.seen){
                            return {
                                ...message,
                                seen: true
                            }
                        }
                        return message
                    })
                    return updatedMessages
                })
            }
        })
    },[socket, curUser._id, messages, selectedConversation])

    useEffect(()=>{
        const getMessages = async()=>{
            try {
                if(selectedConversation.mock)return;
                const res = await fetch(`/api/messages/${selectedConversation.userId}`)
                const data = await res.json()

                if(data.error){
                    showToast("", data.error, "error")
                    return 
                }
                // console.log(data);
                setMessages(data);
            } catch (error) {
                showToast("", error.message, "error");
            } finally {
                setLoadingMessages(false);
            }
        }

        getMessages()
    },[showToast, selectedConversation.userId, selectedConversation.mock]);
  return (
    <Flex flex={"70"} bg={useColorModeValue("gray.200", "gray.dark")} p={2} borderRadius={"md"} flexDirection={"column"}>
        {/* Message Header  */}
        <Flex w={"full"} h={12} alignItems={"center"} gap={2} px={4}>
            <Avatar src={selectedConversation?.userProfilePic} size={"sm"}/>
            <Text fontWeight={"700"}  display={"flex"} alignItems={"center"}>
                {selectedConversation?.username}<Image src={"/verified.png"} w={4} h={4} ml={1} />
            </Text>
        </Flex>

        <Divider/>

        <Flex flexDir={"column"} gap={4} my={4} p={3}  height={"50vh"} overflowY={"auto"}>
            {
                loadingMessages && (
                    [0,1,2,3,4].map((_,i)=>(
                        <Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"} alignSelf={i%2===0?"Flex-start": "flex-end"}>
                            {i%2===0 &&  <SkeletonCircle size={"7"}/>}
                            <Flex flexDirection={"column"} gap={2}>
                                <Skeleton h={"8px"} w={"250px"}/>
                                <Skeleton h={"8px"} w={"250px"}/>
                                <Skeleton h={"8px"} w={"250px"}/>
                            </Flex>
                            {i%2!==0 &&  <SkeletonCircle size={"7"}/>}
                        </Flex>
                    )))
            }

            {!loadingMessages && Array.isArray(messages) &&
            messages.map((message) => (
                <Flex key={message._id} direction={"column"} 
                    ref={messages.length-1 === messages.indexOf(message)?messageEndRef:null}
                >
                    <Message key={message._id} message={message} ownMessage={curUser._id === message.sender} />
                </Flex>
            ))
            }
        </Flex>

        <MessageInput setMessages={setMessages}/>
    </Flex>
  )
}

export default MessageContainer