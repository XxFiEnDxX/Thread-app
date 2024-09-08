import { Flex, Image, Link, useColorMode, Button } from "@chakra-ui/react"
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";
import {AiFillHome} from 'react-icons/ai'
import {RxAvatar} from 'react-icons/rx'
import {Link as RouterLink} from "react-router-dom"
import { Avatar } from '@chakra-ui/react'
import useLogout from "../hooks/useLogout";
import {FiLogOut} from 'react-icons/fi'
import { BsFillChatQuoteFill } from "react-icons/bs";

const Header = () => {
    const { colorMode, toggleColorMode  } = useColorMode();
    const user = useRecoilValue(userAtom)
    const logout = useLogout(); 

  return (
    <Flex justifyContent={"space-between"} mt={6} mb={12}>
        <Link as={RouterLink} to={"/"}>
          <AiFillHome size={24}/>
        </Link>
      {/* {user && (
      )} */}
      <Flex w={"full"} justify={"center"}>
        <Image
            cursor={"pointer"}
            alt="log"
            w={6}
            src={colorMode === "dark"? "/light-logo.svg" : "/dark-logo.svg"}
            onClick={toggleColorMode}
        />
      </Flex>
        
        {user && (
          <Flex alignItems={"center"} gap={4}>

            <Link as={RouterLink} to={`/${user.username}`}>
              <RxAvatar size={24}/>
              {/* <Avatar name='' src={user?.profilePic} size={"sm"}/> */}
            </Link>
            <Link as={RouterLink} to={`/chat`}>
              <BsFillChatQuoteFill size={20}/>
              {/* <Avatar name='' src={user?.profilePic} size={"sm"}/> */}
            </Link>
            <Button size={"xs"} onClick={logout}>
            <FiLogOut size={22}/>
            </Button>
          </Flex>
      )}
    </Flex>
  )
}

export default Header