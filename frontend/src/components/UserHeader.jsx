import { Box, VStack, Flex, Text, Link, Portal, useToast, Button } from "@chakra-ui/react"
// import { Flex } from "@chakra-ui/react"
import { Avatar } from "@chakra-ui/avatar"
import { BsInstagram } from "react-icons/bs"
import { CgMoreO } from "react-icons/cg"
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
  } from '@chakra-ui/react'
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"

import {Link as RouteLink} from "react-router-dom"
import { useState } from "react"
import useShowToast from "../hooks/useShowToast"

const UserHeader = ({user}) => {
    const curUser = useRecoilValue(userAtom)  // logged in user
    const showToast = useShowToast()

    const [following , setFollowing] = useState(user.followers.includes(curUser._id))
    const [updating, setUpdating] = useState(false);
    
    
    const toast = useToast()

    const copyURL = ()=>{
        const currentURL = window.location.href;
        navigator.clipboard.writeText(currentURL)
        .then(()=>{        toast({
            title: 'Account created.',
            description: "Profile link copied!",
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        })
    }

    const handleFollowUnfollow = async() => {
        try {
            if(!curUser._id){
                showToast("Error", "Please login to follow", "error")
                return;
            }
            setUpdating(true)
            const res = await fetch(`/api/users/follow/${user._id}`,{
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                }
            })

            const data = await res.json()

            if(data.error){
                showToast("Error", error, "error")
                return 
            }

            
            if(following){
                showToast("Success", data.message, "success")
                user.followers.pop();
            }else{
                showToast("Success", data.message, "success")
                user.followers.push(curUser._id);
            }
                setFollowing(!following)
        } catch (error) {
            showToast("Error", error, "error")
        } finally {
            setUpdating(false)
        }
    }
  return (
    <VStack gap={4} alignItems={"start"}>
        <Flex justifyContent={"space-between"} w={"full"}>
            <Box>
                <Text fontSize={"2xl"} fontWeight={"bold"}>
                    {user.name}
                </Text>
                <Flex gap={2} alignItems={"center"}>
                    <Text fontSize={"sm"}>{user.username}</Text>
                    <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>thread.net</Text>
                </Flex>
            </Box>
            <Box>
                {user.profilePic? 
                <Avatar name={user.name} src={user.profilePic} size={
                    {
                        base: "md",
                        md: "xl",
                    }
                }/>
                :
                <Avatar name={user.name} src={""} size={
                    {
                        base: "md",
                        md: "xl",
                    }
                }/>
            }
            </Box>
        </Flex>
        <Text>
        {user.bio}
        </Text>
        {curUser._id == user._id && (
            <Link as={RouteLink} to="/update">
                <Button size={"sm"}>
                    Update Profile
                </Button>
            </Link>
        )}
        {curUser._id !== user._id && (
                <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>

                    {following? "Unfollow" : "Follow"}
                </Button>
        )}
        <Flex w={"full"} justifyContent={"space-between"}>
            <Flex gap={2} alignItems={"center"}>
                <Text color={"gray.light"}>{user.followers.length} followers</Text>
                <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
                <Link color={"gray.light"}>instagram.com</Link>
            </Flex>
            <Flex>
                <Box className="icon-container">
                    <BsInstagram size={24}></BsInstagram>
                </Box>
                <Box className="icon-container">
                    <Menu>
                        <MenuButton>
                            <CgMoreO size={24}></CgMoreO>
                        </MenuButton>
                        <Portal>
                            <MenuList bg={"gray.dark"}>
                                <MenuItem bg={"gray.dark"} onClick={copyURL}>Copy Link</MenuItem>
                            </MenuList>
                        </Portal>
                    </Menu>
                </Box>
            </Flex>
        </Flex>
        <Flex w={"full"}>
            <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb={3} cursor={"pointer"}>
                <Text fontWeight={"Bold"}>Thread</Text>
            </Flex>
            <Flex flex={1} borderBottom={"1.5px solid gray"} justifyContent={"center"} color={"gray.light"} pb={3} cursor={"pointer"}>
                <Text fontWeight={"Bold"}>Repiles</Text>
            </Flex>
        </Flex>
    </VStack>
  )
}

export default UserHeader