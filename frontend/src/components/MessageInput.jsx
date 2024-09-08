import { Text, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { useState } from 'react';
import { IoSendSharp  } from "react-icons/io5";
import useShowToast from '../hooks/useShowToast';
import { conversationAtom, selectedConversationAtom } from '../atoms/messageAtom';
import { useRecoilState, useRecoilValue } from 'recoil';

const Messageinput = ({setMessages}) => {
  const [textMessage, setTextMessage] = useState("")
  const showToast = useShowToast();

  const selectedConversation = useRecoilValue(selectedConversationAtom)
  const [conversations, setConversations] = useRecoilState(conversationAtom);

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if(!textMessage)return;
    else{
      try {
        const res = await fetch("/api/messages/",{
          method: "POST",
          headers:{
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipientId: selectedConversation?.userId,
            message: textMessage,
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
                  text: typeof textMessage === 'string' ? textMessage : 'Invalid text', // Ensure string
                  sender: typeof data?.sender === 'string' ? data.sender : 'Unknown sender', // Ensure string
                },
              };
            }
            return conversation;
          });
          return updatedConversations;
        });

        setTextMessage("");
      } catch (error) {
        showToast("",error?.message, "error");
      }
    }
  }

  return (
    <form onSubmit={handleSendMessage}>
        <InputGroup>
            <Input w={"full"} placeholder='Type a message' onChange={(e)=>setTextMessage(e.target.value)} value={textMessage}/>
            <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
                <IoSendSharp color={"green.500"}/>
            </InputRightElement>
        </InputGroup>
    </form>
  )
}

export default Messageinput