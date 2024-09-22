import { Button, Text, Flex, Box } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";
import { FiLogOut } from "react-icons/fi";

const SettingsPage = () => {
  const showToast = useShowToast();
  const logout = useLogout();
  const freezeAccount = async () => {
    if (!window.confirm("Are you sure you want to freeze your account")) return;

    try {
      const res = await fetch("/api/users/freeze", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.error) {
        return showToast("", data.error, "error");
      }

      logout();
      showToast("", "Your account has been frozen", "success");
    } catch (error) {
      showToast("", error.message, "error");
    }
  };
  return (
    <Flex p={5} flexDir={"column"} justifyContent={"space-between"}>
      <Flex flexDir={"column"} w={"full"}>
        <Text my={1} fontWeight={"bold"}>
          Freeze your Account!
        </Text>
        <Text my={1}>You can unfreeze your account anytime by logging</Text>
        <Button
          my={2}
          colorScheme="red"
          size={"sm"}
          variant={"outline"}
          onClick={freezeAccount}
        >
          Freeze
        </Button>
      </Flex>
      <Flex  flexDir={"column"} w={"full"} mt={8}>
        <Text my={1} fontWeight={"bold"}>
          Logout your Account!
        </Text>
      <Button size={"xs"} onClick={logout} my={2} h={"40px"}>
        <FiLogOut size={22} />
      </Button>
      </Flex>
    </Flex>
  );
};

export default SettingsPage;
