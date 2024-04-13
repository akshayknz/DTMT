import {
  Box,
  Container,
  Flex,
  Avatar,
  Text,
  Button,
  DropdownMenu,
} from "@radix-ui/themes";
import logo from "../assets/logo.png";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { getLastSelectedOrganization, getOrganization, getUser } from "../db";
import { OrganizationProps, UserProps } from "../interfaces/interfaces";
import { RiMore2Fill, RiNotification4Line } from "react-icons/ri";
import Navigations from "./Navigations";
import { useSelector } from "react-redux";
import { RootState } from "../context/store";

const Navbar = () => {
  const { handleLogOut } = useContext(AuthContext);
  const { userId } = useContext(AuthContext);
  const [user, setUser] = useState({} as UserProps);
  const params = useParams();
  const [organizationData, setOrganizationData] = useState(
    {} as OrganizationProps
  );
  const navigateTo = useSelector((state: RootState) => state.app.navigateTo);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(()=>{
    if(navigateTo) navigate(navigateTo);
    
  },[navigateTo])
  useEffect(() => {
    if (userId) {
      getUser(userId).then((v) => setUser(v as UserProps));
      if (params.id) {
        getLastSelectedOrganization(userId).then((v) => {
          getOrganization(v, userId).then((vv) => {
            setOrganizationData(vv);
          });
        });
      }
    } else {
      setUser({} as UserProps);
    }
  }, [userId]);
  return (
    <>
    {userId? <Box
        style={{
          borderRadius: "var(--radius-3)",
          position: "sticky",
          zIndex: "100",
          top: "0px",
          marginBottom: "0px",
          padding: "10px 7px 0px 7px",
          backdropFilter: "blur(7px)",
          WebkitBackdropFilter: "blur(3px)",
        }}
        mx={"2"}
        className={`${userId ? "authenticated" : ""}`}
      >
        <Box style={{}}>
          <Container>
            <Flex gap="2" align="stretch" justify={"between"}>
              <Flex gap="2" align="center">
                <Text>Hi {user.displayName && user.displayName.split(" ")[0]},</Text>
              </Flex>
              <Flex gap="2" align="center">
                {userId && (
                  <>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <Box
                          style={{
                            padding: 0,
                            margin: 0,
                          }}
                        >
                          <Avatar
                            style={{
                              padding: 0,
                              margin: 0,
                            }}
                            radius="full"
                            size={"4"}
                            fallback="A"
                            src={user.photoURL}
                          />
                        </Box>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content size="2" style={{ width: "200px" }}>
                        <DropdownMenu.Item>Sharing</DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item>Trash</DropdownMenu.Item>
                        <DropdownMenu.Item>Settings</DropdownMenu.Item>

                        <DropdownMenu.Separator />
                        <DropdownMenu.Item
                          color="red"
                          onClick={() => {
                            handleLogOut();
                            navigate("/login");
                          }}
                        >
                          Log out
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </>
                )}

                {/* <button className="btn-logout" onClick={handleLogOut}>Log out</button> */}
              </Flex>
            </Flex>
          </Container>
        </Box>
      </Box>:<Box
        style={{
          borderRadius: "var(--radius-3)",
          position: "sticky",
          zIndex: "100",
          top: `${userId ? "6px" : "10px"}`,
          marginBottom: "20px",
          padding: `${userId ? "6px" : "10px"}`,
          backdropFilter: "blur(7px)",
          WebkitBackdropFilter: "blur(3px)",
        }}
        mx={"2"}
        className={`${userId ? "authenticated" : ""}`}
      >
        <Box style={{}}>
          <Container>
            <Flex gap="2" align="stretch" justify={"between"}>
              <Flex gap="2" align="center">
                <Avatar
                  src={logo}
                  size={`${userId ? "1" : "2"}`}
                  fallback="A"
                />
                {organizationData.name ? (
                  <Text size={"1"} weight={"medium"}>
                    {organizationData.name}
                  </Text>
                ) : (
                  <Text>DeckHouse</Text>
                )}
              </Flex>
              <Flex gap="2" align="center">
                {userId && (
                  <>
                    <Button variant="soft">
                      <RiNotification4Line />
                    </Button>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <Button
                          variant="soft"
                          style={{
                            padding: 0,
                            margin: 0,
                          }}
                        >
                          <Avatar
                            style={{
                              padding: 0,
                              margin: 0,
                            }}
                            size={`${userId ? "2" : "2"}`}
                            fallback="A"
                            src={user.photoURL}
                          />
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content size="2" style={{ width: "200px" }}>
                        <DropdownMenu.Item>Sharing</DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item>Trash</DropdownMenu.Item>
                        <DropdownMenu.Item>Settings</DropdownMenu.Item>

                        <DropdownMenu.Separator />
                        <DropdownMenu.Item
                          color="red"
                          onClick={() => {
                            handleLogOut();
                            navigate("/login");
                          }}
                        >
                          Log out
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </>
                )}

                {/* <button className="btn-logout" onClick={handleLogOut}>Log out</button> */}
              </Flex>
            </Flex>
          </Container>
        </Box>
      </Box>}
      
      <Outlet />
      <Navigations />
    </>
  );
};
export default Navbar;
