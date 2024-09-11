import { Flex, Button, Spinner, Box} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import { useEffect, useState } from 'react'
import useShowToast from '../hooks/useShowToast'
import Post from '../components/Post'
import postAtom from '../atoms/postAtom'
import SuggestedUser from '../components/SuggestedUser.jsx'


const HomePage = () => {
  const curUser = useRecoilValue(userAtom)
  const showToast = useShowToast()
  const [posts, setPosts] = useRecoilState(postAtom)
  const [loading, setLoading] = useState(true)


  useEffect(()=>{
    const getFeed = async()=>{
      setLoading(true)
      setPosts([])
      try {
        const res = await fetch("/api/posts/feed")
        const data = await res.json()

        if(data.error){
          showToast("", data.error, "error")
          return
        }

        console.log(data);
        setPosts(data)
        
      } catch (error) {
        showToast("", error, "error")
      } finally {
        setLoading(false)
      }
    };
    getFeed()
  },[showToast, setPosts])
  return (
    <Flex gap={"10"} alignItems={"flex-start"}>
      <Box flex={70}>
          {
          loading && (
            <Flex justifyContent={"center"}>
                <Spinner size="xl"/>
            </Flex>)
          }
          {
            !loading && posts.length === 0 && <h1>Nothing To Show.</h1>
          }
          {
            posts.map((post)=>(
              <Post key={post._id} post={post} postedBy={post.postedBy}/>
            ))
          }
      </Box>
      <Box flex={30} 
        display={{
          base: 'none',
          md: 'block'
        }}
      >
        <SuggestedUser/>
        
      </Box>
    </Flex>
  )
}

export default HomePage