import { Flex, Avatar, Text, Divider, Button } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { BsThreeDots } from 'react-icons/bs'
import Actions from '../components/Actions.jsx'
import { useState } from 'react'
import Comment from '../components/Comment.jsx'

const PostPage = () => {
    const [liked, setLiked] = useState(false);
  return (
    <>
    <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
            <Avatar src='/zuck-avatar.png' size={"md"} name='Mark'/>
            <Flex>
                <Text fontSize={"sm"} fontWeight={"bold"}>Mark</Text>
                <Image src='/verified.png' w={4} h={4} ml={4}/>
            </Flex>
        </Flex>

        <Flex gap={4} alignItems={"center"}>
            <Text fontSize={"sm"} color={"gray.light"}>1d</Text>
            <BsThreeDots/>
        </Flex>
    </Flex>
    <Text my={3}>Let's talk about the threads.</Text>
    <Box
                        borderRadius={6}
                        overflow={"hidden"}
                        border={"1px solid"}
                        borderColor={"gray.light"}>
                        <Image src={"/post1.png"} w={"full"} alt='' />
                    </Box>
    <Flex gap={3} my={3}>
        <Actions liked={liked} setLiked={setLiked}/>
    </Flex>
    <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"} fontSize={"sm"}>{527} replies</Text>
                    <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
                    <Text color={"gray.light"} fontSize={"sm"}>{263+(liked?1:0)} likes</Text>
    </Flex>
    <Divider my={4}/>

    <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"2xl"}>🐱👋</Text>
            <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
    </Flex>
    
    <Divider my={4}/>
    <Comment 
    comment="Looks Really good!"
    likes={234}
    createdAt={"1d"}
    username={"amit.fiend"}
    userAvatar={"https://64.media.tumblr.com/dc683b72ef5f2f0a8a832cc7726d54c3/b2633daa8b23fbc6-4c/s1280x1920/dec79c2dbb3d446c97a57e78f15a8a0c49c32e6b.jpg"}/>
    <Comment 
    comment="Dude! that was awesome!"
    likes={24}
    createdAt={"1d"}
    username={"pransh4"}
    userAvatar={"https://bit.ly/code-beast"}/>
    <Comment 
    comment="Illuminati!"
    likes={777}
    createdAt={"99d"}
    username={"fiend"}
    userAvatar={"https://bit.ly/prosper-baba"}/>
    </>
  )
}

export default PostPage