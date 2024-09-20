import { IoAdd } from "react-icons/io5";
import { Button, useColorModeValue, Textarea, FormControl, Text, useDisclosure, Input, Flex, CloseButton, Image } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
import { useRef, useState } from 'react'
import usePreviewImg from '../hooks/usePreviewImg'

import {BsFillImageFill} from 'react-icons/bs'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import useShowToast from '../hooks/useShowToast'
import postAtom from '../atoms/postAtom'
import { useLocation, useParams } from 'react-router-dom'

const CreatePost = () => {
    const showToast = useShowToast();
    const user = useRecoilValue(userAtom)
    const MAX_CHAR = 500;
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [postText, setPostText] = useState("")
    const {handleImgChange , imgURL, setImgURL} = usePreviewImg()
    const imgRef = useRef()
    const [Loading, setLoading] = useState(false);

    const [posts, setPosts] = useRecoilState(postAtom);

    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);

    const path = useLocation()
    let username = path.pathname.substring(1,path.pathname.length)
    
    const handleTextChange = (e)=>{
        let inputText = e.target.value;

        if(inputText.length > MAX_CHAR){
            inputText = postText;
            setRemainingChar(0);
        }else{
            setPostText(inputText)
            setRemainingChar(MAX_CHAR - inputText.length);
        }
    }

    const handleCreatePost = async()=>{
        setLoading(true)
        try {
            const res = await fetch("/api/posts/create",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    postedBy: user._id,
                    text: postText,
                    img: imgURL
                })
            })
            
            const data = await res.json()
            
            if(data.error){
                showToast("Error", data.error, "error")
                return
            }
            
            if(username === user.username || path.pathname === '/'){
                setPosts([data,...posts])
                console.log(posts);
            }
            showToast("Success", "Post created successfully!", "success");
            onClose()
            setPostText("")
            setImgURL("")
        } catch (error) {
            showToast("", error.message, "error")
        } finally {
            setLoading(false)
        }
    }

  return (
    <>
        <Button 
            bg={useColorModeValue("gray.300","gray.dark")}
            onClick={onOpen}
            size={"md"}
            >
            <IoAdd size={26}/>
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={useColorModeValue('white', 'gray.dark')}>
        <ModalHeader>Create Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
            <FormControl>
                <Textarea placeholder='What would you like to Post today?😊' 
                    onChange={handleTextChange}
                    value={postText}
                />
                <Text fontSize={"xs"}
                fontWeight={"bold"}
                textAlign={"right"}
                m={"1"}
                color={"gray.800"} >
                {remainingChar}/{MAX_CHAR}
            </Text>
            <Input
                type='file'
                hidden
                ref={imgRef}
                onChange={handleImgChange}
            />
            <BsFillImageFill
                style={{marginLeft: "5px", cursor:"pointer"}}
                size = {16}
                onClick={()=>imgRef.current.click()}
            />
            </FormControl>

            {imgURL && (
                <Flex mt={5} w={"full"} position={"relative"}>
                    <Image src={imgURL} alt='Selected Image' />
                    <CloseButton onClick={()=>setImgURL("")}
                        bg={"gray.800"}
                        top={2}
                        right={2}
                        position={"absolute"}
                        >

                    </CloseButton>
                </Flex>
            )}



        </ModalBody>

        <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleCreatePost}
                isLoading={Loading}
                >
                Post
            </Button>
        </ModalFooter>
        </ModalContent>
        </Modal>
            </>
  )
}

export default CreatePost