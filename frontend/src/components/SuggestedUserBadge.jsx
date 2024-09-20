import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

// import useFollowUnfollow from "../hooks/useFollowUnfollow";

const SuggestedUserBadge = ({user}) => {
	const navigate = useNavigate();
    const {handleFollowUnfollow, updating, following} = useFollowUnfollow(user);
  return (
        	<Flex gap={2} justifyContent={"space-between"} alignItems={"center"} onClick={(e)=>{
				navigate(`/${user.username}`)
			}} cursor={"pointer"}>	
			<Flex gap={2}>
				<Avatar src={user.profilePic} />
				<Box>
					<Text fontSize={"sm"} fontWeight={"bold"}>
						{user.username}
					</Text>
					<Text color={"gray.light"} fontSize={"sm"}>
						{user.name}
					</Text>
				</Box>
			</Flex>
			<Button
				size={"sm"}
				color={following ? "black" : "white"}
				bg={following ? "white" : "blue.400"}
				onClick={(e)=>{
					e.stopPropagation()
					handleFollowUnfollow()
				}}
				isLoading={updating}
				_hover={{
					color: following ? "black" : "white",
					opacity: ".8",
				}}
			>
				{following ? "following" : "Follow"}
			</Button>
		</Flex> 
  )
}

export default SuggestedUserBadge