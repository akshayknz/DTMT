import { Box, Container, Flex, Avatar, Text } from "@radix-ui/themes";
import logo from '../assets/logo.png';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { userId, handleLogOut } = useContext(AuthContext)
  return(
        <>
        <Box style={{ background: 'var(--gray-a3)', padding:"10px", borderRadius: 'var(--radius-3)'
        , position:"sticky", zIndex:"100", width:"100%", top:"10px"}}>
                <Container size="1">
                    <Flex gap="2" align="center">
                        <Avatar
                            src={logo} size="2"
                            fallback="A"
                        />
                        <Text>DeckHouse</Text>
                        <button className="btn-logout" onClick={handleLogOut}>Log out</button>
                    </Flex>
                </Container>
            </Box>
        </>
    )
}
export default Navbar;