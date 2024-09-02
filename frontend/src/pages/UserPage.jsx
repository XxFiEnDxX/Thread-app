import { useStatStyles } from "@chakra-ui/react"
import UserHeader from "../components/UserHeader.jsx"
import UserPost from "../components/UserPost.jsx"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useShowToast from "../hooks/useShowToast.js"

const UserPage = () => {
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const {username} = useParams()

  useEffect(()=>{
    const getUser = async()=>{
      try {
        const res = await fetch(`api/users/profile/${username}`)
        const data = await res.json();
        console.log(data);
        

        if(data.error){
          showToast("Error", data.error, "error")
          return 
        }
        setUser(data);
        
      } catch (error) {
        showToast("Error", data.error, "error")
        return
      }
    }

    getUser()
  }, [username, showToast])

  // console.log(user);
  
  if(!user)return null;

  return (
    <>
    <UserHeader user={user}/>
    <UserPost likes={1200} repiles={401} postImg="/post1.png" postTitle="Let's talk about threads."/>
    <UserPost likes={700} repiles={234} postImg="/post2.png" postTitle="Nice Tutorial"/>
    <UserPost likes={890} repiles={463} postImg="/post3.png" postTitle="I love this guy."/>
    <UserPost likes={777} repiles={123} postTitle="This is my first Thread!"/>
    </>
  )
}

export default UserPage