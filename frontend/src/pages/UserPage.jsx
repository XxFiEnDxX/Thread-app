import UserHeader from "../components/UserHeader.jsx"
import UserPost from "../components/UserPost.jsx"

const UserPage = () => {
  return (
    <>
    <UserHeader/>
    <UserPost likes={1200} repiles={401} postImg="/post1.png" postTitle="Let's talk about threads."/>
    <UserPost likes={700} repiles={234} postImg="/post2.png" postTitle="Nice Tutorial"/>
    <UserPost likes={890} repiles={463} postImg="/post3.png" postTitle="I love this guy."/>
    <UserPost likes={777} repiles={123} postTitle="This is my first Thread!"/>
    </>
  )
}

export default UserPage