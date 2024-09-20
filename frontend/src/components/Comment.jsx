import { Flex, Avatar, Text, Divider, Image, useColorModeValue } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";


const Comment = ({ reply, lastReply }) => {
  // const [liked, setLiked] = useState(false);
  // console.log(reply);
  
  return (
    <>
      <Flex gap={4} px={5} py={2} my={1} w={"full"}>
        <Avatar name="" src={reply?.userProfilePic} size={"sm"} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            // justifyContent={""}
            alignItems={"center"}
          >
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {reply?.username}
            </Text>
            <Image src="/verified.png" w={3} h={3} ml={2} />
            {/* <Text
              fontSize={"xs"}
              w={36}
              textAlign={"right"}
              color={"gray.light"}
            >
              {curPost?.createdAt
                ? `${formatDistanceToNow(new Date(curPost.createdAt))} ago`
                : ""}
            </Text> */}
            <Flex gap={4} alignItems={"center"}>
            <Text fontStyle={"sm"} color={"gray.light"}>{}</Text>
            <BsThreeDots/>
            </Flex>
          </Flex>
          <Text fontSize={"s"}>{reply?.text}</Text>
          <Flex gap={1} alignItems={"center"}>
          </Flex>
        </Flex>
      </Flex>
      {!lastReply ? <Divider w={"99.9%"} borderColor={useColorModeValue("#e5e5e5","#323639")} borderWidth={"1.3px"} /> : null}
    </>
  );
};

export default Comment;
