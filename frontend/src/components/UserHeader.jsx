import {
  Box,
  VStack,
  Flex,
  Text,
  Link,
  Portal,
  useToast,
  Button,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
// import { Flex } from "@chakra-ui/react"
import { Avatar } from "@chakra-ui/avatar";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

import { Link as RouteLink } from "react-router-dom";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const UserHeader = ({ user }) => {
  const showToast = useShowToast();

  const curUser = useRecoilValue(userAtom); // logged in user
  const toast = useToast();

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        title: "Account created.",
        description: "Profile link copied!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    });
  };

  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

  return (
    <VStack gap={4} alignItems={"start"}>
      {/* username && avatar */}
      <Flex justifyContent={"space-between"} w={"full"} px={8} mt={7}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"} ml={1}>
            <Text fontSize={"sm"}>{user.username}</Text>
            <Text
              fontSize={"xx-small"}
              bg={useColorModeValue("#323639", "gray.light")}
              color={useColorModeValue("gray.light","gray.dark")}
              p={1}
              borderRadius={"full"}
            >
              thread.net
            </Text>
          </Flex>
        </Box>
        <Box mr={2}>
          <Avatar
            name={user.name}
            src={user.profilePic}
            size={{
              base: "md",
              md: "xl",
            }}
          />
        </Box>
      </Flex>
      {/* Bio  */}
      <Text px={8}>{user.bio}</Text>

      <Flex w={"full"} justifyContent={"space-between"} px={8}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={22}></BsInstagram>
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={22}></CgMoreO>
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>
                    Copy Link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      {/* button  */}
      <Flex px={8} w={"full"} py={4}>
        {curUser?._id == user?._id && (
          <Flex
            as={RouteLink}
            to="/update"
            py={1}
            px={5}
            bg={"#181818"}
            border={"1px"}
            borderRadius={"lg"}
            borderColor={"whiteAlpa.900"}
            justify={"center"}
            maxW={"full"}
            w={"full"}
          >
            <Box color={"whiteAlpha.900"} fontWeight={"500"}>
              Edit profile
            </Box>
          </Flex>
        )}
        {curUser?._id !== user?._id && (
          <Flex
            py={1}
            px={5}
            
            onClick={handleFollowUnfollow}
            bg={following ? useColorModeValue( "whiteAlpha.900" , "#181818"):useColorModeValue("#181818" , "whiteAlpha.900")}
            color={following ? useColorModeValue( "#181818" , "whiteAlpha.900"):useColorModeValue("whiteAlpha.900" , "#181818")}
            border={"1px"}
            borderRadius={"lg"}
            borderColor={useColorModeValue("#181818","gray.100")}
            justify={"center"}
            maxW={"full"}
            w={"full"}>
            <Box fontWeight={"500"}>
              {updating? <Spinner size={"sm"}/>:(following ? "Following" : "Follow")}
            </Box>
          </Flex>
        )}
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"2px"}
          borderColor={useColorModeValue("gray.800","whiteAlpha.900")}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
          >
          <Text fontWeight={"Bold"}>Thread</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"2px"}
          borderColor={useColorModeValue("#b8b8b9","gray")}
          color={useColorModeValue("#b8b8b9","gray")}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"Bold"}>Repiles</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
