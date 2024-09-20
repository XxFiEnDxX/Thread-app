import {
  Flex,
  Image,
  Link,
  useColorMode,
  Button,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Avatar } from "@chakra-ui/react";
import useLogout from "../hooks/useLogout";
import { FiLogOut } from "react-icons/fi";
import CreatePost from "./CreatePost";

import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { IoSearch } from "react-icons/io5";
import { IoChatbubblesSharp } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { FaUser } from "react-icons/fa6";
import { useEffect, useState } from "react";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  const path = useLocation();
  const [activeBtn, setActiveBtn] = useState(0);

  useEffect(() => {
    if (path.pathname === "/") setActiveBtn(1);
    else if (path.pathname === "/search") setActiveBtn(2);
    else if (path.pathname === "/chat") setActiveBtn(3);
    else if (
      path.pathname.substring(1, path.pathname.length) === user?.username
    )
      setActiveBtn(4);
    else if (path.pathname === "/settings") setActiveBtn(5);
  }, [setActiveBtn]);

  return (
    <Flex
      flexDir={"column"}
      justifyContent={"space-between"}
      alignItems={"center"}
      h={"full"}
      w={"80px"}
      py={8}
      position={"fixed"}
      left={0}
      top={"50%"}
      transform={"translatey(-50%)"}
      zIndex={1000}
      bg={useColorModeValue("gray.light", "gray.dark")}

      // border={"1px"}
      // borderRadius={"lg"}
      // borderColor={"gray.800"}
    >
      <Box>
        <Image
          cursor={"pointer"}
          alt="log"
          w={6}
          src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
          onClick={toggleColorMode}
        />
      </Box>

      {user && (
        <Box
          display={"flex"}
          justifyContent={"space-around"}
          alignItems={"center"}
          flexDir={"column"}
          h={"360px"}
        >
          <Link as={RouterLink} to={"/"}>
            <AiFillHome
              size={24}
              fill={
                activeBtn === 1
                  ? useColorModeValue("#000000", "#f4f5f7")
                  : useColorModeValue("#b8b8b9", "#3a3a3a")
              }
              onClick={() => setActiveBtn(1)}
            />
          </Link>

          <Link as={RouterLink} to={`/search`}>
            <IoSearch
              size={24}
              fill={
                activeBtn === 2
                  ? useColorModeValue("#000000", "#f4f5f7")
                  : useColorModeValue("#b8b8b9", "#3a3a3a")
              }
              onClick={() => setActiveBtn(2)}
            />
          </Link>

          <CreatePost />

          <Link as={RouterLink} to={`/chat`}>
            <IoChatbubblesSharp
              size={24}
              fill={
                activeBtn === 3
                  ? useColorModeValue("#000000", "#f4f5f7")
                  : useColorModeValue("#b8b8b9", "#3a3a3a")
              }
              onClick={() => setActiveBtn(3)}
            />
          </Link>

          <Link as={RouterLink} to={`/${user?.username}`}>
            {/* <FaUser
            size={24}
            fill={
              activeBtn === 4
                ? useColorModeValue("#000000", "#f4f5f7")
                : useColorModeValue("#b8b8b9", "#3a3a3a")
            }
            onClick={() => setActiveBtn(4)}
          /> */}

            <Avatar
              src={user?.profilePic}
              size={"sm"}
              boxSizing="border-box"
              border={activeBtn === 4 ? "2px" : "0px"}
              borderColor={
                activeBtn === 4
                  ? useColorModeValue("#000000", "#f4f5f7")
                  : useColorModeValue("#b8b8b9", "#3a3a3a")
              }
              onClick={() => setActiveBtn(4)}
            />
          </Link>
        </Box>
      )}

      <Box>
        <Link as={RouterLink} to={`/settings`}>
          <IoMdSettings
            size={26}
            fill={
              activeBtn === 5
                ? useColorModeValue("#000000", "#f4f5f7")
                : useColorModeValue("#b8b8b9", "#3a3a3a")
            }
            onClick={() => setActiveBtn(5)}
          />
        </Link>
      </Box>

      {/* <Button size={"xs"} onClick={logout}>
        <FiLogOut size={22} />
      </Button> */}
    </Flex>
  );
};

export default Header;
