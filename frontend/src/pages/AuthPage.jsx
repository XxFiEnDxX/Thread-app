import { useRecoilValue } from "recoil"
import authScreenAtom from "../atoms/authAtom.jsx"
import LoginCard from "../components/LoginCard.jsx"
import SignupCard from "../components/SignupCard.jsx"


const AuthPage = () => {
    const authScreenState = useRecoilValue(authScreenAtom)
    console.log(authScreenState);
    
  return (
    <>
        {authScreenState === "login"?<LoginCard/>:<SignupCard/>}
    </>
  )
}

export default AuthPage