import { Link, replace, useNavigate, useParams, } from "react-router-dom"
import { Flex, Avatar, Text, useColorModeValue, Divider } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import Actions from "./Actions"
import { useEffect, useState } from "react"
import useShowToast from "../hooks/useShowToast"
import {formatDistanceToNow} from "date-fns"
import {DeleteIcon} from "@chakra-ui/icons"
import { useRecoilState, useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import postAtom from "../atoms/postAtom"

const Post = ({ post, postedBy, lastPost }) => {
    const { id } = useParams();
    const [liked, setLiked] = useState(false);
    const [user, setUser] = useState(null);
    const showToast = useShowToast();
    const navigate = useNavigate();
    const curUser = useRecoilValue(userAtom);
    const [posts, setPosts] = useRecoilState(postAtom);

    useEffect(() => {
        const postUser = async () => {
            try {
                const res = await fetch("/api/users/profile/" + postedBy);
                const data = await res.json();
                if (data.error) {
                    showToast("", data.error, "error");
                    return;
                }
                setUser(data);
            } catch (error) {
                showToast("", error, "error");
                setUser(null);
            }
        };
        postUser();
    }, [postedBy, showToast]);

    const handleDeletePost = async (e) => {
        try {
            e.preventDefault();
            if (!window.confirm("Are you sure you want to delete this post?")) return;

            const res = await fetch(`/api/posts/${post._id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (data.error) {
                showToast("", data.error, "error");
                return;
            }
            showToast("", "Post Deleted!", "success");
            setPosts((prev) => prev.filter((p) => p._id !== post._id));
        } catch (error) {
            showToast("", error, "error");
        }
    };

    return (
        <Link to={`/${user?.username}/post/${post?._id}`}>
            <Flex gap={3} mb={3} py={5} pl={5} pr={10} >
                {/* left part */}
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar
                        size={"md"}
                        name="Mark"
                        src={user?.profilePic}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(`/${user?.username}`);
                        }}
                    />
                    <Box
                        w={"2px"}
                        h={"full"}
                        bg={useColorModeValue("#e5e5e5", "#323639")}
                        my={3}
                    ></Box>
                    <Box position={"relative"} w={"full"}>
                        {post?.replies?.length === 0 && (
                            <Text textAlign={"center"}>🥱</Text>
                        )}
                        {post.replies[0] && (
                            <Avatar
                                size={"xs"}
                                position={"absolute"}
                                padding={"2px"}
                                top={"0px"}
                                left={"15px"}
                                name={post?.replies[0]?.username}
                                src={post?.replies[0]?.userProfilePic}
                            />
                        )}
                        {post.replies[1] && (
                            <Avatar
                                size={"xs"}
                                position={"absolute"}
                                padding={"2px"}
                                bottom={"0px"}
                                right={"-5px"}
                                name={post?.replies[1]?.username}
                                src={post?.replies[1]?.userProfilePic}
                            />
                        )}
                        {post.replies[2] && (
                            <Avatar
                                size={"xs"}
                                position={"absolute"}
                                padding={"2px"}
                                bottom={"0px"}
                                left={"4px"}
                                name={post?.replies[2]?.username}
                                src={post?.replies[2]?.userProfilePic}
                            />
                        )}
                    </Box>
                </Flex>
                {/* Right part */}
                <Flex flex={1} flexDirection={"column"} gap={2}>
                    <Flex justifyContent={"space-between"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text
                                fontSize={"sm"}
                                fontWeight={"bold"}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/${user?.username}`);
                                }}
                            >
                                {user?.username}
                            </Text>
                            <Image
                                src="/verified.png"
                                alt=""
                                w={4}
                                h={4}
                                ml={1}
                            />
                        </Flex>
                        <Flex gap={4} alignItems={"center"}>
                            <Text
                                fontSize={"xs"}
                                w={36}
                                textAlign={"right"}
                                color={"gray.light"}
                            >
                                {formatDistanceToNow(new Date(post?.createdAt))}{" "}
                                ago
                            </Text>
                            {curUser?._id === user?._id && (
                                <DeleteIcon
                                    size={20}
                                    cursor={"pointer"}
                                    onClick={handleDeletePost}
                                />
                            )}
                        </Flex>
                    </Flex>

                    <Text fontSize={"sm"}>{post.text}</Text>
                    {post.img && (
                        <Box
                            borderRadius={6}
                            overflow={"hidden"}
                            borderColor={"gray.light"}
                        >
                            <Image src={post.img} w={"full"} alt="" />
                        </Box>
                    )}
                    <Flex>
                        <Actions post={post} />
                    </Flex>
                </Flex>
            </Flex>
            {post?._id !== lastPost ? (
                <Divider
                    mt={6}
                    mb={1}
                    w={"full"}
                    borderColor={useColorModeValue(
                        "#e5e5e5",
                        "#323639"
                    )}
                    borderWidth={"1.4px"}
                />
            ) : (
                ""
            )}
        </Link>
    );
};

export default Post;
