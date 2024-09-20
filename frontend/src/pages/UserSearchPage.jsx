import {
  Flex,
  Input,
  Button,
  useColorModeValue,
  Box,
  Avatar,
  Text
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import SuggestedUser from "../components/SuggestedUser";
import { IoSearch } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { useNavigate } from "react-router-dom";



const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const UserSearchPage = () => {
  const [input, setInput] = useState("");
  const [searchedUser, setSearchedUser] = useState([]);
  const showToast = useShowToast();
  const navigate = useNavigate();

  const debouncedInput = useDebounce(input, 300);

  useEffect(() => {
    const handleUserSearch = async () => {
      if (!debouncedInput) {
        setSearchedUser([]); // Clear suggestions if input is empty
        return;
      }

      try {
        console.log(debouncedInput);
        
        const res = await fetch(`/api/users/searchUser?input=${debouncedInput}`);
        const data = await res.json();

        if (data.error) {
          return showToast("", data.error, "error");
        }

        setSearchedUser(data);
      } catch (error) {
        showToast("", error.message, "error");
      }
    };
    handleUserSearch();
  }, [debouncedInput, showToast]);


  return (
    <Flex w={"full"} p={5}>
      <Flex flex={"55"} alignItems={"flex-start"} direction={"column"} mr={5}>
        <Flex
          w={"full"}
          alignItems={"center"}
          justifyContent={"space-between"}
          bgColor={useColorModeValue("white", "#121212")}
          borderRadius={15}
          borderWidth={"1px"}
          px={2}
          py={1}
        >
          <Box ml={3}>
            <IoSearch size={20} />
          </Box>
          <Input
            px={3}
            variant=""
            placeholder="Search"
            bg="transparent"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
        </Flex>

        <Flex py={5} gap={3} pl={5} w={"full"} direction={"column"}>
          {searchedUser.map((user) => (
            <Flex
              key={user._id}
              gap={2}
              justifyContent={"space-between"}
              alignItems={"center"}
              onClick={(e) => {
                navigate(`/${user.username}`);
              }}
              cursor={"pointer"}
            >
              <Flex gap={2}>
                <Avatar size={"sm"} src={user.profilePic} />
                <Box>
                  <Text fontSize={"small"} fontWeight={"bold"}>
                    {user.username}
                  </Text>
                  <Text color={"gray.light"} fontSize={"x-small"}>
                    {user.name}
                  </Text>
                </Box>
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>
      <Flex flex={"45"} flexDir={"column"}>
        <SuggestedUser />
      </Flex>
    </Flex>
  );
};

export default UserSearchPage;
