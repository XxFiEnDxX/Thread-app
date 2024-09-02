import { Flex, Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'

const HomePage = () => {
  const curUser = useRecoilValue(userAtom)
  return (
    <Link to={`/${curUser.username}`}>
        <Flex w={"full"} justifyContent={'center'}>
            <Button mx={"auto"}>
                Visit Profile page
            </Button>
        </Flex>
    </Link>
  )
}

export default HomePage