import { Flex, Text, Box } from '@chakra-ui/react'
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import SuggestedUserBadge from './SuggestedUserBadge.jsx'
import useShowToast from '../hooks/useShowToast.js'



const SuggestedUser = () => {
    const [loading, setLoading] = useState(false);
    const [suggestedUsers, setSuggestedUsers] = useState([])
    const showToast = useShowToast();

	useEffect(() => {
		const getSuggestedUsers = async () => {
			setLoading(true);
			try {
				const res = await fetch("/api/users/suggested");
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setSuggestedUsers(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};

		getSuggestedUsers();
	}, [showToast]);

  return (
    <>
    <Text mb={4} fontWeight={"bold"}>
    Suggested User
    </Text>
    <Flex direction={"column"} gap={4}>
            {
                !loading && suggestedUsers.map((user)=>(<SuggestedUserBadge key={user._id} user={user}/>))
            }
            {
                loading && (
                    [0,1,2,3,4].map((_,i)=>(
                        <Flex key={i} gap={2} alignItems={"center"} p={"1"} borderRadius={"md"}>
                            <Box>
                                <SkeletonCircle size={"10"}/>
                            </Box>
                            <Flex flexDirection={"column"} w={"full"} gap={2}>
                                <Skeleton h={"8px"} w={"80px"}/>
                                <Skeleton h={"8px"} w={"90px"}/>
                            </Flex>
                            <Flex>
                                <Skeleton h={"20px"} w={"60px"}/>
                            </Flex>
                        </Flex>
                    )))
            }
    </Flex>
    </>
  )
}

export default SuggestedUser