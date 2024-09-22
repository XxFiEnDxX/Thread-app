import { Flex, Text } from '@chakra-ui/react'
import React from 'react'

const NoThreadYet = () => {
  return (
    <Flex w={"full"} justifyContent={"center"} py={10}>
        <Text color={"gray"}>
        No threads yet.
        </Text>
    </Flex>
  )
}

export default NoThreadYet