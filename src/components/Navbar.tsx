import { Box, Container, Flex, Avatar, Text } from "@radix-ui/themes";
import logo from '../assets/logo.png';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const Navbar = () => {
  const { handleLogOut } = useContext(AuthContext)
  return(
        <>
        <Box style={{  borderRadius: 'var(--radius-3)',background: 'var(--gray-a3)'
        , position:"sticky", zIndex:"100", top:"10px", marginBottom:"20px"
        , padding:"10px"}} mx={"2"}>
            <Box style={{marginBottom:"5px", }}>
                <Container>
                    <Flex gap="2" align="center">
                        <Avatar
                            src={logo} size="2"
                            fallback="A"
                            onClick={handleLogOut}
                        />
                        <Text>DeckHouse</Text>
                        {/* <button className="btn-logout" onClick={handleLogOut}>Log out</button> */}
                    </Flex>
                </Container></Box>
            </Box>
            <Outlet/>
        </>
    )
}
export default Navbar;