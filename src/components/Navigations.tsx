import { Box, Container, Flex, Avatar, Text, Button, DropdownMenu } from "@radix-ui/themes";
import logo from '../assets/logo.png';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet, useNavigate, useParams } from "react-router-dom";
import { getLastSelectedOrganization, getOrganization, getUser } from "../db";
import { OrganizationProps, UserProps } from "../interfaces/interfaces";
import { RiMore2Fill, RiNotification4Line } from "react-icons/ri";
import { IoIosAdd, IoIosArrowBack, IoIosArrowRoundBack, IoIosMenu } from "react-icons/io";

const Navigations = () => {
    const { handleLogOut } = useContext(AuthContext)
    const navigate = useNavigate();
    const { userId } = useContext(AuthContext)
    const [user, setUser] = useState({} as UserProps)
    const params = useParams();
    const [organizationData, setOrganizationData] = useState({} as OrganizationProps)
    useEffect(() => {
        if (userId) {
            getUser(userId).then(v => setUser(v as UserProps))
            if (params.id) {
                getLastSelectedOrganization(userId).then(v => {
                    getOrganization(v, userId).then(vv => {
                        setOrganizationData(vv)
                    })
                })
            }
        } else {
            setUser({} as UserProps)
        }
    }, [userId])
    return (
        <>
        {
            userId && <Box className="bottom-navigation">
            <Box className="buttons-wrapper">
            <Box style={{color:"#fff", marginRight:0}}><IoIosArrowRoundBack size="25"/></Box>
            <Box style={{background:"#fff", marginRight:0}}><IoIosAdd size="25"/></Box>
            <Box style={{color:"#fff"}}><IoIosMenu size="25"/></Box>
                
            </Box>
        </Box>
        }
        
            
        </>
    )
}
export default Navigations;