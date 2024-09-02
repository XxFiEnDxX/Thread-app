import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
  } from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import { CgPassword } from 'react-icons/cg'
import { json } from 'react-router-dom'
// recoil atoms
import userAtom from '../atoms/userAtom'
import authScreenAtom from '../atoms/authAtom'
// hooks
import useShowToast from '../hooks/useShowToast'

  export default function LoginCard() {
    const [showPassword, setShowPassword] = useState(false)

    const setAuthScreen = useSetRecoilState(authScreenAtom)
    const setUser = useSetRecoilState(userAtom)

    const [inputs, setInputs] = useState({
      username: "",
      password: "",
    });
    const showToast = useShowToast();
    
    const handleLogin = async()=>{
      try {
        const res = await fetch("/api/users/login",{
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(inputs)
        })

        const data = await res.json()
        if(data.error){
          showToast("Error", data.error, "error")
          return ;
        }
        
        console.log(data);
        localStorage.setItem("user-threads", JSON.stringify(data));
        setUser(data)
      } catch (error) {
        showToast("Error", error, "error")
      }
    }
    return (
      <Flex
        align={'center'}
        justify={'center'}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Log in
            </Heading>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.dark')}
            boxShadow={'lg'}
            p={8}
            w={{
              base:"full",
              sm:"400px"
            }}
            >
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input value={inputs.usename}
                onChange={(e)=>setInputs((inputs)=>({...inputs, username: e.target.value }))}
                type="text" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                  value={inputs.password}
                  onChange={(e)=>setInputs((inputs)=>({...inputs, password: e.target.value}))}
                  type={showPassword ? 'text' : 'password'} />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() => setShowPassword((showPassword) => !showPassword)}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText="Submitting"
                  size="lg"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  onClick={handleLogin}
                  >
                  Log in
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Don't have an account? <Link onClick={()=>setAuthScreen("signup")} color={'blue.400'}>Sign up</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    )
  }