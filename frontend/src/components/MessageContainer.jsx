import { Flex, Avatar, useColorModeValue, Text, Image, Divider, SkeletonCircle, Skeleton } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Message from './Message.jsx'
import MessageInput from './MessageInput.jsx'
import useShowToast from '../hooks/useShowToast.js'
import { selectedConversationAtom } from '../atoms/messageAtom.jsx'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom.jsx'

const MessageContainer = () => {
    const showToast = useShowToast()
    const selectedConversation = useRecoilValue(selectedConversationAtom)
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [messages, setMessages] = useState([]);
    const curUser = useRecoilValue(userAtom)
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

        <Flex flexDir={"column"} gap={4} my={4} p={3} height={"400px"} overflowY={"auto"}>
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
                <Message key={message._id} message={message} ownMessage={curUser._id === message.sender} />
            ))
            }
        </Flex>

        <MessageInput setMessages={setMessages}/>
    </Flex>
  )
}

export default MessageContainer