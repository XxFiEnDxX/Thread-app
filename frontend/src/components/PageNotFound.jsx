import { Flex } from '@chakra-ui/react'
import React from 'react'

const PageNotFound = () => {
  return (
    <Flex w={"100"} zIndex={10001} bg={"red"} >
        <h1>Page not found</h1>
    </Flex>
  )
}

export default PageNotFound