import { Box, Flex,Image, useColorMode, useColorModeValue } from "@chakra-ui/react";
import React from "react";

const LogoHeader = () => {
    const { colorMode, toggleColorMode } = useColorMode();
  return (
      <Flex w={"full"} justify={"center"} py={3} mb={2} position={"sticky"} top={"0"} left={"0"} zIndex={1000}  bg={useColorModeValue("gray.light", "gray.dark")}>
        <Image
          cursor={"pointer"}
          alt="log"
          w={6}
          src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
          onClick={toggleColorMode}
        />
      </Flex>
  );
};

export default LogoHeader;
