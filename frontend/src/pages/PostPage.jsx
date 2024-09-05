import { Flex, Avatar, Text, Divider, Button, Spinner, useRadio, } from '@chakra-ui/react'
import {DeleteIcon} from "@chakra-ui/icons"
import { Image } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { BsThreeDots } from 'react-icons/bs'
import Actions from '../components/Actions.jsx'
import { useEffect, useState } from 'react'
import Comment from '../components/Comment.jsx'
import useGetUserProfile from '../hooks/useGetUserProfile.js'
import useShowToast from '../hooks/useShowToast.js'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {formatDistanceToNow} from "date-fns"
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom.jsx'
import Post from '../components/Post.jsx'
import postAtom from '../atoms/postAtom.jsx'

const PostPage = () => {
    const curUser = useRecoilValue(userAtom)
    const {user, loading} = useGetUserProfile()
    const [posts, setPosts] = useRecoilState(postAtom)
    const showToast = useShowToast()
    const {pid} = useParams()
    const navigate = useNavigate()

    const curPost = posts[0]
    useEffect(()=>{
        const getPost = async()=>{
            setPosts([])
            try {
            const res = await fetch(`/api/posts/${pid}`)
            const data = await res.json()

            if(data.error){
                showToast("", data.error, "error")
                return
            }

            // console.log(data)
            setPosts([data])
            
            } catch (error) {
            showToast("", error.message, "error")
            }
        }
        getPost()
    },[showToast, pid, setPosts])

    const handleDeletePost = async()=>{
        try {
            if(!window.confirm("Are you sure you want to delete this post?"))return;

            const res = await fetch(`/api/posts/${curPost._id}`,{
                method:"DELETE"
            });

            const data = await res.json()

            if(data.error){
                showToast("", data.error, "error")
                return
            }
            showToast("", "Post Deleted!", "success")
            navigate(`/${user.username}`)

        } catch (error) {
            showToast("", error, "error")
        }
    }

    if(!user && !curPost && loading){
        return (
            <Flex justifyContent={"center"}>
                <Spinner size={"xl"}/>
            </Flex>
        )
    }

  return (
    <>
    <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
            <Avatar src={user?.profilePic} size={"md"} name={user?.name}/>
            <Flex>
                <Text fontSize={"sm"} fontWeight={"bold"}>{user?.username}</Text>
                <Image src='/verified.png' w={4} h={4} ml={4}/>
            </Flex>
        </Flex>

        <Flex gap={4} alignItems={"center"}>
            <Text fontSize={"xs"} w={36} textAlign={"right"} color={"gray.light"}>
                {curPost?.createdAt ? `${formatDistanceToNow(new Date(curPost.createdAt))} ago` : ""}
                {/* {formatDistanceToNow(new Date(post?.createdAt))} ago */}
                </Text>
            {curUser?._id === user?._id && <DeleteIcon size={20} cursor={"pointer"} onClick={handleDeletePost}/>}
        </Flex>
    </Flex>
    <Text my={3}>{curPost?.text}</Text>
    {
        curPost?.img &&
        <Box borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}>
        <Image src={curPost?.img} w={"full"} alt='' />
    </Box>
    }
    <Flex gap={3} my={3}>
        <Actions post={curPost}/>
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
    {
        curPost?.replies.map(reply => (
            <Comment key={reply?._id} reply={reply}
            lastReply = {reply?._id === curPost.replies[curPost.replies.length-1]._id}
            />
        ))
    }
    {/* <Comment 
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
    userAvatar={"https://bit.ly/prosper-baba"}/> */}
    </>
  )
}

export default PostPage