import { Flex, Avatar, Text, Divider } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import Actions from './Actions'


const Comment = ({reply, lastReply}) => {
    // const [liked, setLiked] = useState(false);
  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
          <Avatar name='' src={reply?.userProfilePic} size={"sm"}/>
          <Flex gap={1} w={"full"} flexDirection={"column"}>
            <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
                <Text fontSize={"sm"} fontWeight={"bold"}>{reply?.username}</Text>
                {/* <Flex gap={4} alignItems={"center"}> */}
                        {/* <Text fontStyle={"sm"} color={"gray.light"}>{createdAt}</Text> */}
                        {/* <BsThreeDots/> */}
                  {/* </Flex> */}
            </Flex>
            <Text>
              {reply?.text}
            </Text>
            {/* <Actions liked={liked} setLiked={setLiked}/> */}
            <Flex gap={1} alignItems={"center"}>
              {/* <Text color={"gray.light"} fontSize={"sm"}>{527} replies</Text> */}
              {/* <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box> */}
              {/* <Text color={"gray.light"} fontSize={"sm"}>{likes+(liked?1:0)} likes</Text> */}
            </Flex>
          </Flex>
      </Flex>
      {!lastReply?<Divider/>:null}
    </>
  )
}

export default Comment