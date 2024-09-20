import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
} from '@chakra-ui/react'
import { Text, Input, InputGroup, InputRightElement, Flex, Image } from '@chakra-ui/react'
import { useRef, useState } from 'react';
import { IoSendSharp  } from "react-icons/io5";
import useShowToast from '../hooks/useShowToast';
import { conversationAtom, selectedConversationAtom } from '../atoms/messageAtom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { BsFillImageFill } from "react-icons/bs"
import usePreviewImg from "../hooks/usePreviewImg.js"


const Messageinput = ({setMessages}) => {
  const [textMessage, setTextMessage] = useState("")
  const showToast = useShowToast();

  const selectedConversation = useRecoilValue(selectedConversationAtom)
  const [conversations, setConversations] = useRecoilState(conversationAtom);

  const imageRef = useRef(null);
  const {onClose} = useDisclosure()

  const {handleImgChange, imgURL, setImgURL} = usePreviewImg()
  const [isSending, setIsSending] = useState(false)

  const handleSendMessage = async (e) => {
    // console.log("damn");
    
      e.preventDefault()
      
      if(!textMessage && !imgURL)return;
      if(isSending)return;

      setIsSending(true)
      try {
        const res = await fetch("/api/messages/",{
          method: "POST",
          headers:{
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipientId: selectedConversation?.userId,
            message: textMessage,
            image: imgURL
          }),
        })
        const data = await res.json();
        
        //console.log(data);
        if(data?.error){
          showToast("", data?.error, "error")
          return;
        }
        setMessages((messages)=>[...messages, data])

        setConversations((conversations) => {
          const updatedConversations = conversations.map((conversation) => {
            if (conversation._id === selectedConversation._id) {
              return {
                ...conversation,
                lastMessage: {
                  text: textMessage,
                  sender: data.sender,
                },
              };
            }
            return conversation;
          });
          return updatedConversations;
        });
        setTextMessage("");
        setImgURL("");
      } catch (error) {
        showToast("",error?.message, "error");
      } finally {
        setIsSending(false)
      }
  }

  return (
    <Flex gap={2} alignItems={"center"}>
      <form onSubmit={handleSendMessage} style={{flex:95}}>
          <InputGroup>
              <Input w={"full"} placeholder='Type a message' onChange={(e)=>setTextMessage(e.target.value)} value={textMessage}/>
              <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
                  <IoSendSharp color={"green.500"}/>
              </InputRightElement>
          </InputGroup>
      </form>

      <Flex flex={5} cursor={"pointer"}>
        <BsFillImageFill size={20} onClick={()=> imageRef.current.click()}/>
          <input type="file" hidden ref={imageRef} onChange={handleImgChange}/>
      </Flex>

        <Modal isOpen={imgURL} onClose={()=>{
          onClose()
          setImgURL("")
        }}> 

        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
              <Flex mt={5} w={"full"}>
                  <Image src={imgURL}/>
              </Flex>
              <Flex justifyContent={"flex-end"} my={2}>
                {!isSending ? (<IoSendSharp size={20} cursor={"pointer"} onClick={handleSendMessage}/>):(<Spinner size={"md"}/>)}
              </Flex>
          </ModalBody>
        </ModalContent>
        </Modal>


    </Flex>
  )
}

export default Messageinput