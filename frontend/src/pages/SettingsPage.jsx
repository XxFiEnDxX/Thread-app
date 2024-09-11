import { Button, Text } from '@chakra-ui/react'
import useShowToast from '../hooks/useShowToast'
import useLogout from '../hooks/useLogout';

const SettingsPage = () => {
    const showToast = useShowToast();
    const logout = useLogout()
    const freezeAccount = async()=>{
        if(!window.confirm("Are you sure you want to freeze your account")) return

        try {
            const res = await fetch("/api/users/freeze",{
                method: "PUT",
                headers: {"Content-Type":"application/json"},
            })
            
            const data = await res.json()

            if(data.error){
                return showToast("",data.error, "error");
            }

            logout()
            showToast("","Your account has been frozen", "success")
        } catch (error) {
            showToast("", error.message, "error")
        }
    }
  return (
        <>
            <Text my={1} fontWeight={"bold"}>Freeze your Account!</Text>
            <Text my={1}>You can unfreeze your account anytime by logging</Text>
            <Button
                colorScheme='red'
                size={"sm"}
                variant={"outline"}
                onClick={freezeAccount}
            >Freeze</Button>
        </>
  )
}

export default SettingsPage