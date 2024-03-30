import {
  Box,
  Container,
  Flex,
  Avatar,
  Text,
  Button,
  DropdownMenu,
  Popover,
} from "@radix-ui/themes";
import logo from "../assets/logo.png";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { getLastSelectedOrganization, getOrganization, getUser } from "../db";
import { OrganizationProps, UserProps } from "../interfaces/interfaces";
import { RiMore2Fill, RiNotification4Line } from "react-icons/ri";
import {
  IoIosAdd,
  IoIosArrowBack,
  IoIosArrowRoundBack,
  IoIosMenu,
} from "react-icons/io";

const Navigations = () => {
  const { handleLogOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useContext(AuthContext);
  const [user, setUser] = useState({} as UserProps);
  const params = useParams();
  const [organizationData, setOrganizationData] = useState(
    {} as OrganizationProps
  );
  useEffect(() => {
    console.log(location.pathname);

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
      {userId && (
        <Box className="bottom-navigation">
          <Box className="buttons-wrapper">
            <Box
              onClick={() => navigate("/dashboard")}
              className={`back-button 
              ${Object.keys(params).length != 0 && "show-back-button"}
              ${location.pathname == "/create-organization" && "show-back-button"}
              
              `}
              style={{ color: "#fff", marginRight: 0 }}
            >
              <IoIosArrowRoundBack />
            </Box>

            <Box
              onClick={() => navigate("/create-organization")}
              style={{ background: "#fff", marginRight: 0 }}
            >
              <IoIosAdd />
            </Box>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Box style={{ color: "#fff" }}>
                  <IoIosMenu />
                </Box>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content size="2">
                <DropdownMenu.Item>About Deckhouse</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>Export</DropdownMenu.Item>
                <DropdownMenu.Item>Archive</DropdownMenu.Item>
                <DropdownMenu.Item>Trash</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Sub>
                  <DropdownMenu.SubTrigger>
                    Your Account
                  </DropdownMenu.SubTrigger>
                  <DropdownMenu.SubContent>
                    <DropdownMenu.Item>Account Settings</DropdownMenu.Item>
                    <DropdownMenu.Item>Logout</DropdownMenu.Item>
                  </DropdownMenu.SubContent>
                </DropdownMenu.Sub>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>Share</DropdownMenu.Item>
                <DropdownMenu.Item>Indeces</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item shortcut="⌘ ⌫" color="red">
                  Logout
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Box>
        </Box>
      )}
    </>
  );
};
export default Navigations;
