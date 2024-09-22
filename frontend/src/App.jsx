import { Button, Container, Box, useColorModeValue } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import Header from "./components/Header.jsx";

import UserPage from "./pages/UserPage.jsx";
import PostPage from "./pages/PostPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import userAtom from "./atoms/userAtom.jsx";
import { useRecoilValue } from "recoil";
import UpdateProfilePage from "./pages/UpdateProfilePage.jsx";
import CreatePost from "./components/CreatePost.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import LogoHeader from "./components/LogoHeader.jsx";
import SuggestedUser from "./components/SuggestedUser.jsx";
import UserSearchPage from "./pages/UserSearchPage.jsx";

function App() {
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();
  return (
    <>
      <Box position={"relative"} w={"full"} pl={20} py={10}>
        {/* <Container px={"0px"}  maxW={pathname === "/"? {base: "620px", md:"900px"} : "650px"}> */}

        <Container
          my={10}
          px={0}
          py={2}
          // maxW={pathname === "/"? {base: "620px", md:"900px"} : "650px"}
          minW={"425px"}
          maxW={"650px"}
          minH={"380px"}
          borderRadius={20}
          border={pathname === "/chat" ? "0px" : "2px"}
          bg={useColorModeValue("#ffffff", "#181818")}
          borderColor={useColorModeValue("#e5e5e5", "#323639")}
          >
          {/* <LogoHeader/> */}
          <Header/>
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  <>
                    <HomePage />
                  </>
                ) : (
                  <Navigate to={"/auth"} />
                )
              }
            />
            <Route
              path="/settings"
              element={user ? <SettingsPage /> : <Navigate to={"/auth"} />}
            />
            <Route path="/search" element={<UserSearchPage/>} />
            <Route
              path="/auth"
              element={!user ? <AuthPage /> : <Navigate to={"/"} />}
            />
            <Route
              path="/update"
              element={user ? <UpdateProfilePage /> : <Navigate to={"/auth"} />}
            />
            <Route path="/:username" element={<UserPage />} />
            <Route path="/:username/post/:pid" element={<PostPage />} />
            <Route
              path="/chat"
              element={user ? <ChatPage /> : <Navigate to={"/auth"} />}
            />
          </Routes>
        </Container>
      </Box>
    </>
  );
}

export default App;
