import { Box, Flex, Spinner, useStatStyles, Divider, useColorModeValue } from "@chakra-ui/react"
import UserHeader from "../components/UserHeader.jsx"
import UserPost from "../components/UserPost.jsx"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useShowToast from "../hooks/useShowToast.js"
import Post from "../components/Post.jsx"
import useGetUserProfile from "../hooks/useGetUserProfile.js"
import { useRecoilState } from "recoil"
import postAtom from "../atoms/postAtom.jsx"
import NoThreadYet from "../components/NoThreadYet.jsx"
import PageNotFound from "../components/PageNotFound.jsx"
import { MdBrokenImage } from "react-icons/md";

const UserPage = () => {
  const {user, loading} = useGetUserProfile()
  const showToast = useShowToast();
  const {username} = useParams()
  const [posts, setPosts] = useRecoilState(postAtom);
  const [fetching, setFetching] = useState(true)



  useEffect(()=>{
    const getPost = async()=>{
      if(!user)return;
      setFetching(true)
      try {
        const res = await fetch(`/api/posts/user/${username}`)
        const data = await res.json()

        // console.log(data);
        setPosts(data)
        
      } catch (error) {
        showToast("", error.message, "error")
      } finally {
        setFetching(false)
      }
    }

    getPost()
  }, [username, showToast, setPosts, user])

  // console.log(user);
  if(!user && loading){
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"}/>
      </Flex>
    );
  }

  // if(!user && !loading)return <PageNotFound/>;
  if(!user && !loading)return <Flex h={"300px"} justifyContent={"center"} alignItems={"center"} flexDir={"column"}>
    <MdBrokenImage size={26} />
      <h1>Page not found!</h1>
  </Flex>;

  return (
    <>
    <UserHeader user={user}/>
    {!fetching && posts?.length === 0 && <NoThreadYet/>}
    {fetching && (
      <Flex justifyContent={"center"} my={12}>
        <Spinner size={"xl"}/>
      </Flex>
    )}
    {
      posts.map((post)=>(
        <Post key={post?._id} post={post} postedBy={post?.postedBy} lastPost={posts[posts.length-1]._id}/>
      ))
    }
    </>
  )
}

export default UserPage