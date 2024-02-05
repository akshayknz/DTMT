import { Box, Container, Flex, Avatar, Text, Button, DropdownMenu } from "@radix-ui/themes";
import logo from '../assets/logo.png';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet, useNavigate, useParams } from "react-router-dom";
import { getOrganization, getUser } from "../db";
import { OrganizationProps, UserProps } from "../interfaces/interfaces";

const Navbar = () => {
    const { handleLogOut } = useContext(AuthContext)
    const navigate = useNavigate();
    const { userId } = useContext(AuthContext)
    const [user, setUser] = useState({} as UserProps)
    const params = useParams();
    const [organizationData, setOrganizationData] = useState({} as OrganizationProps)
    useEffect(() => {
        if (userId) {
            getUser(userId).then(v => setUser(v as UserProps))
            if(params.id){
                getOrganization(params.id, userId).then(v => setOrganizationData(v))
            }
        } else {
            setUser({} as UserProps)
        }
    }, [userId])
    return (
        <>
            <Box style={{
                borderRadius: 'var(--radius-3)', background: 'var(--gray-a3)'
                , position: "sticky", zIndex: "100", top: `${userId ? "6px" : "10px"}`, marginBottom: "20px"
                , padding: `${userId ? "6px" : "10px"}`, backdropFilter:"blur(3px)", WebkitBackdropFilter:"blur(3px)"
            }} mx={"2"} className={`${userId ? "authenticated" : ""}`}>
                <Box style={{}}>
                    <Container>
                        <Flex gap="2" align="stretch" justify={"between"}>
                            <Flex gap="2" align="center">
                                <Avatar
                                    src={logo} size={`${userId ? "1" : "2"}`}
                                    fallback="A"
                                />
                                {organizationData.name ? <Text size={"1"}>{organizationData.name}</Text> : <Text>DeckHouse</Text>}
                            </Flex>

                            {userId &&
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger>
                                        <Avatar
                                            size={`${userId ? "1" : "2"}`}
                                            fallback="A"
                                            src={user.photoURL}
                                        />
                                    </DropdownMenu.Trigger>
                                    <DropdownMenu.Content size="1">
                                        <DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>
                                        <DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>
                                        <DropdownMenu.Separator />
                                        <DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>

                                        <DropdownMenu.Separator />
                                        <DropdownMenu.Item shortcut="⌘ ⌫" color="red" onClick={() => {
                                            handleLogOut();
                                            navigate("/login")
                                        }}>
                                            Log out
                                        </DropdownMenu.Item>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
                            }

                            {/* <button className="btn-logout" onClick={handleLogOut}>Log out</button> */}
                        </Flex>
                    </Container></Box>
            </Box>
            <Outlet />
        </>
    )
}
export default Navbar;