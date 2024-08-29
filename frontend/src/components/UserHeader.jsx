import { Box, VStack, Flex, Text, Link, Portal, useToast } from "@chakra-ui/react"
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

const UserHeader = () => {
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
  return (
    <VStack gap={4} alignItems={"start"}>
        <Flex justifyContent={"space-between"} w={"full"}>
            <Box>
                <Text fontSize={"2xl"} fontWeight={"bold"}>
                    Mark Zuckerberg
                </Text>
                <Flex gap={2} alignItems={"center"}>
                    <Text fontSize={"sm"}>Mark Zuckerberg</Text>
                    <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>thread.net</Text>
                </Flex>
            </Box>
            <Box>
                <Avatar name='Mark ZZ' src='/zuck-avatar.png' size={
                    {
                        base: "md",
                        md: "xl",
                    }
                }/>
            </Box>
        </Flex>
        <Text>
            Cofounder, of Somthing you Know!
        </Text>
        <Flex w={"full"} justifyContent={"space-between"}>
            <Flex gap={2} alignItems={"center"}>
                <Text color={"gray.light"}>3.2K followers</Text>
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