import { Flex, useColorModeValue, WrapItem, Avatar, Stack, Text, Image, useColorMode } from '@chakra-ui/react'
import { AvatarBadge } from '@chakra-ui/react'
import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { BsCheck2All } from 'react-icons/bs';
import { selectedConversationAtom } from '../atoms/messageAtom';

const Conversation = ({conversation}) => {
  const user = conversation?.participants[0];
  const lastMessage = conversation?.lastMessage;
  const curUser = useRecoilValue(userAtom);
  const lastMessageLen = 15;
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom)
  // console.log("->",selectedConversation);

  const colorMode = useColorMode();
  

  return (
    <Flex gap={4} alignItems={"center"} p={1} _hover={{cursor:"pointer", bg:useColorModeValue("gray.800","gray.dark"), color:"white"}} borderRadius={"md"} 
    onClick={()=> setSelectedConversation({
              _id: conversation?._id,
              userId: user?._id,
              userProfilePic: user?.profilePic,
              username:user?.username,
              mock: conversation?.mock
            })
          }
    bg={(selectedConversation?._id === conversation?._id) ? (colorMode==="light"?"gray.400":"gray.dark"):""}
    >
        <WrapItem>
            <Avatar name='' src={user?.profilePic} size={{base:"xs", sm:"sm",}}>
            <AvatarBadge boxSize={"1em"} bg={"green.500"}/>
            </Avatar>
        </WrapItem>
        <Stack direction={"column"} fontSize={"sm"}>
            <Text fontWeight={"700"}  display={"flex"} alignItems={"center"}>
              {user?.username} <Image src={"/verified.png"} w={4} h={4} ml={1} />
            </Text>
            <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
                  {(curUser?._id === lastMessage?.sender) ? <BsCheck2All size={16}/>:""}
                  {(lastMessage?.text?.length > lastMessageLen)? lastMessage?.text?.substring(0,lastMessageLen)+"..." : lastMessage?.text}
            </Text>
        </Stack>
    </Flex>
  )
}

export default Conversation