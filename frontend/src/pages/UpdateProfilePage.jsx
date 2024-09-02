'use client'

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
} from '@chakra-ui/react'
import { SmallCloseIcon } from '@chakra-ui/icons'
import { useRef, useState } from 'react'
import { CgPassword } from 'react-icons/cg'
import userAtom from '../atoms/userAtom'
import { useRecoilState } from 'recoil'
import usePreviewImg from '../hooks/usePreviewImg'
import useShowToast from '../hooks/useShowToast'

export default function UpdateProfilePage() {
    const [user, setUser] = useRecoilState(userAtom);
    const [inputs, setInpts] = useState({
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        password: "",
    })
    const [updating, setUpdating] = useState(false);
    const {handleImgChange , imgURL} = usePreviewImg()

    const showToast = useShowToast();

    const fileRef = useRef(null);  // react hook
    const handleSubmit = async(e)=>{
      e.preventDefault();
      setUpdating(true);
      try {
        console.log({...inputs, profilePic: imgURL});
        const res = await fetch(`/api/users/update/${user._id}`,{
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({...inputs, profilePic: imgURL})
        })

        const data = await res.json()
        if(data.error){
          showToast("Error", data.error, "error") 
        }

        showToast("Success", "Profile update successfully!✅", "success")
        setUser(data);
        localStorage.setItem("user-threads", JSON.stringify(data));

      } catch (error) {
        showToast("Error", error, "error")
      } finally {
        setUpdating(false)
      }
    }

  return (

    <form onSubmit={handleSubmit}>
    <Flex
      align={'center'}
      justify={'center'}>
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.dark')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          User Profile Edit
        </Heading>
        <FormControl id="userName">
          <Stack direction={['column', 'row']} spacing={6}>
            <Center>
              <Avatar size="xl" src={imgURL || user.profilePic}>

              </Avatar>
            </Center>
            <Center w="full">
              <Button w="full" onClick={()=>fileRef.current.click()}>Change Avatar</Button>
              <Input type='file' hidden ref={fileRef} onChange={handleImgChange}/>
            </Center>
          </Stack>
        </FormControl>
        <FormControl>
          <FormLabel>Full name</FormLabel>
          <Input
            onChange={(e)=>setInpts({...inputs, name: e.target.value})}
            value={inputs.name}
            _placeholder={{ color: 'gray.500' }}
            type="text"
            />
        </FormControl>
        <FormControl>
          <FormLabel>User name</FormLabel>
          <Input
            value={inputs.username}
            onChange={(e)=>{setInpts({...inputs, username: e.target.value})}}
            _placeholder={{ color: 'gray.500' }}
            type="text"
            />
        </FormControl>
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input
            value={inputs.email}
            onChange={(e)=>{setInpts({...inputs, email: e.target.value})}}
            _placeholder={{ color: 'gray.500' }}
            type="email"
            />
        </FormControl>
        <FormControl>
          <FormLabel>Bio</FormLabel>
          <Input
            value={inputs.bio}
            onChange={(e)=>{setInpts({...inputs, bio: e.target.value})}}
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            value={inputs.password}
            onChange={(e)=>{setInpts({...inputs, password: e.target.value})}}
            _placeholder={{ color: 'gray.500' }}
            type="password"
          />
        </FormControl>
        <Stack spacing={6} direction={['column', 'row']}>
          <Button
          type='submit'
            bg={'red.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'red.500',
            }}>
            Cancel
          </Button>
          <Button
            bg={'green.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'green.500',
            }}
            type='submit'
            isLoading={updating}
            >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
    </form>
  )
}