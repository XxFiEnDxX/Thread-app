import { SearchIcon } from '@chakra-ui/icons'
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import { Box, Text, Input, Button, useColorModeValue } from '@chakra-ui/react'
import { Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Conversation from '../components/Conversation.jsx'
import {GiConversation} from "react-icons/gi"
import MessageContainer from "../components/MessageContainer.jsx";
import useShowToast from '../hooks/useShowToast.js'
import { useRecoilState, useRecoilValue } from 'recoil'
import { conversationAtom, selectedConversationAtom } from '../atoms/messageAtom.jsx'
import userAtom from '../atoms/userAtom.jsx'

const ChatPage = () => {
    const showToast = useShowToast()
    const [loadingconversation, setLoadingConversation] = useState(true);
    const [conversations, setConversations] = useRecoilState(conversationAtom);
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom)
    const [searchText, setSearchText] = useState("")
    const [searchingUser, setSearchingUser] = useState(false)
    const curUser = useRecoilValue(userAtom)

    useEffect(()=>{
        const getConversation = async()=>{
            try {
                const res = await fetch("/api/messages/conversations")
                
                const data = await res.json()

                if(data.error){
                    return showToast("", data.error, "error")
                }
                
                setConversations(data)
                console.log(conversations);
            } catch (error) {
                showToast("", error, "error");
            } finally {
                setLoadingConversation(false);
            }
        }

        getConversation()
    },[showToast, setConversations, setLoadingConversation]);

    const handleConversationSearch = async(e) =>{
        e.preventDefault();

        setSearchingUser(true);
        try {
            const res = await fetch(`/api/users/profile/${searchText}`)
            const data = await res.json();

            if(data.error){
                showToast("", data.error, "error")
                return;
            }
            
            if(data?._id === curUser._id){
                showToast("","you can't message yourself", "error")
                return;
            }

            const conversationAlreadyExist = conversations.find(conversation => conversation.participants[0]._id === data._id)
            if(conversationAlreadyExist){
                setSelectedConversation({
                    _id: conversationAlreadyExist._id,
                    userId: data?._id,
                    userProfilePic: data?.profilePic,
                    username:data?.username
                  })
                return
            }

            const mockConversation = {
                mock: true,
                lastMessage: {
                    text: "",
                    sender: ""
                },
                _id: Date.now(),
                participants: [
                    {
                        _id: data._id,
                        username: data.username,
                        profilePic: data.profilePic,
                    }
                ]
            }
            setConversations(prevCon => [...prevCon, mockConversation]);
        } catch (error) {
            showToast("", error, "error");
        } finally {
            setSearchingUser(false);
        }
    }

  return (
    <Box position={"absolute"} w={{base:"100%",md:"80%", lg:"750px"}} p={4} left="50%" transform={"translateX(-50%)"}>
        <Flex gap={4} flexDirection={{base:"column",md: "row"}} maxW={{sm:"400px",md:"full"}}mx={"auto"}>
            <Flex flex={30} gap={2} flexDirection={"column"} maxW={{sm: "250px", md: "full"}} mx={"auto"}>
                <Text fontWeight={700} color={useColorModeValue("gray.600, gray.400")}>Your Chats</Text>
                <form onSubmit={handleConversationSearch}>
                    <Flex alignItems={"center"} gap={2}>
                        <Input placeholder='Search' onChange={(e)=>setSearchText(e.target.value)} value={searchText}/>
                        <Button size={"sm"} onClick={handleConversationSearch} isLoading={searchingUser}><SearchIcon/></Button>
                    </Flex>
                </form>

                {
                    loadingconversation && (
                        [0,1,2].map((_,i)=>(
                            <Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
                                <Box>
                                    <SkeletonCircle size={"10"}/>
                                </Box>
                                <Flex w={"full"} flexDirection={"column"} gap={3}>
                                    <Skeleton h={"10px"} w={"80px"}/>
                                    <Skeleton h={"8px"} w={"90%"}/>
                                </Flex>
                            </Flex>
                        ))
                    )
                }
                {
                    !loadingconversation && (
                        conversations?.map(conversation=>(
                            <Conversation key={conversation._id} conversation={conversation}/>
                        ))
                    )
                }
            </Flex>

            {!selectedConversation._id && <Flex flex={70} borderRadius={"md"} p={2} flexDir={"column"} alignItems={"center"} justifyContent={"center"} height={"400px"}>
                <GiConversation size={100}/>
                <Text fontSize={20}>
                    Select a conversation to start messaging
                </Text>
            </Flex> }

            {selectedConversation._id && <MessageContainer/>}
        </Flex>
    </Box>
  )
}

export default ChatPage