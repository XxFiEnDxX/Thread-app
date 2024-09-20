import { Avatar, Flex, Text, Box, Image } from '@chakra-ui/react'
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import { selectedConversationAtom } from '../atoms/messageAtom'
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import {BsCheck2All} from "react-icons/bs"
import { useState } from 'react';

const Message = ({ownMessage, message }) => {
    const selectedConversation = useRecoilValue(selectedConversationAtom);
    const curUser = useRecoilValue(userAtom)
    const [imgLoaded, setImgLoaded] = useState(false)
    

  return (
    <>
    {ownMessage?(

        <Flex  gap={2} alignSelf={"flex-end"}>
            {message.text && (
                <Flex  maxW={"350px"} bg={"green.800"} p={1} borderRadius={"md"}>
                    <Text  color={'white'}>
                        {message?.text}
                    </Text>
                    <Box alignSelf={"flex-end"} ml={1} color={message.seen ? "blue.400" : ""} fontWeight={"bold"}>
                        <BsCheck2All size={16}/>
                    </Box>
                </Flex>
            )}
            {message.image && !imgLoaded && (
                <Flex mt={5} w={"200px"}>
                    <Image
                        hidden
                        onLoad={()=>setImgLoaded(true)}
                        src={message.image}
                        alt="Message img"
                        borderRadius={4}
                    />
                    <Skeleton w={"200px"} h={"200px"}/>
                </Flex>
            )}
            {message.image && imgLoaded && (
                <Flex mt={5} w={"200px"}>
                    <Image
                        src={message.image}
                        alt="Message img"
                        borderRadius={4}
                    />
                    <Box alignSelf={"flex-end"} ml={1} color={message.seen ? "blue.400" : ""} fontWeight={"bold"}>
                        <BsCheck2All size={16}/>
                    </Box>
                </Flex>
            )}

            <Avatar src={curUser?.profilePic} w={7} h={7}/>
        </Flex>
        ):(
            <Flex gap={2} >
            <Avatar src={selectedConversation?.userProfilePic} w={7} h={7}/>
            {message.text && (
                <Text maxW={"350px"} bg={"gray.400"} p={1} borderRadius={"md"} color={"black"}>
                    {message?.text}
                </Text>
            )}
            {message.image && !imgLoaded && (
                <Flex mt={5} w={"200px"}>
                    <Image
                        hidden
                        onLoad={()=>setImgLoaded(true)}
                        src={message.image}
                        alt="Message img"
                        borderRadius={4}
                    />
                    <Skeleton w={"200px"} h={"200px"}/>
                </Flex>
            )}
            {message.image && imgLoaded && (
                <Flex mt={5} w={"200px"}>
                    <Image
                        src={message.image}
                        alt="Message img"
                        borderRadius={4}
                    />
                </Flex>
            )}
            </Flex>
        )}
    </>
  )
}

export default Message