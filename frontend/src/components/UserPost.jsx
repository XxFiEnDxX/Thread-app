import { Link, replace } from "react-router-dom"
import { Flex, Avatar, Text } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'

import { BsThreeDots } from "react-icons/bs"
import Actions from "./Actions"
import { useState } from "react"

const UserPost = ({likes, repiles, postImg, postTitle}) => {
    const [liked, setLiked] = useState(false);
  return (
    <Link to={"/mark/post/1"}>
        <Flex gap={3} mb={4} py={5}>
            {/* left  part*/}
            <Flex flexDirection={"column"} alignItems={"center"}>
                <Avatar size={"md"} name="Mark" src='/zuck-avatar.png' />
                <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
                <Box position={"relative"} w={"full"}> 
                    <Avatar size={"xs"} position={"absolute"} padding={"2px"} top={"0px"} left={"15px"} name="john" src='https://bit.ly/dan-abramov' />
                    <Avatar size={"xs"} position={"absolute"} padding={"2px"} bottom={"0px"} right={"-5px"} name="john" src='https://bit.ly/kent-c-dodds' />
                    <Avatar size={"xs"} position={"absolute"} padding={"2px"} bottom={"4px"} left={"4px"} name="john" src='https://bit.ly/sage-adebayo' />
                </Box>
            </Flex>
                {/* Right part */}
            <Flex flex={1} flexDirection={"column"} gap={2}>
                <Flex justifyContent={"space-between"}>
                    <Flex w={"full"} alignItems={"center"}>
                        <Text fontSize={"sm"} fontWeight={"bold"}>Mark</Text>
                        <Image src='/verified.png' alt='' w={4} h={4} ml={1}/>
                    </Flex>
                    <Flex gap={4} alignItems={"center"}>
                        <Text fontStyle={"sm"} color={"gray.light"}>1d</Text>
                        <BsThreeDots/>
                    </Flex>
                </Flex>

                <Text fontSize={"sm"}>{postTitle}</Text>
                {postImg && (
                    <Box
                        borderRadius={6}
                        overflow={"hidden"}
                        border={"1px solid"}
                        borderColor={"gray.light"}>
                        <Image src={postImg} w={"full"} alt='' />
                    </Box>
                )}
                <Flex>
                    <Actions liked={liked} setLiked={setLiked}/>
                </Flex>
                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"} fontSize={"sm"}>{repiles} replies</Text>
                    <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
                    <Text color={"gray.light"} fontSize={"sm"}>{likes+(liked?1:0)} likes</Text>
                </Flex>
            </Flex>
        </Flex>

    </Link>
  )
}

export default UserPost