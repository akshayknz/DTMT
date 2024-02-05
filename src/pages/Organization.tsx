import { Box, Button, Container, Heading, Text } from "@radix-ui/themes";
import { useParams } from "react-router-dom";
import { getOrganization, getUser } from "../db";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { OrganizationProps, UserProps } from "../interfaces/interfaces";
export function Component() {
    const params = useParams();
    const [user, setUser] = useState({} as UserProps)
    const [organizationData, setOrganizationData] = useState({} as OrganizationProps)
    const { userId } = useContext(AuthContext)
    useEffect(()=>{
        getUser(userId).then(v => setUser(v as UserProps))
        getOrganization(params.id, userId).then(v=>setOrganizationData(v))
    },[])
    
    return (
            <Container px="3">
                <Box pt={"3"} pb={"3"}>
                    <Text>Hi {user.displayName && user.displayName.split(' ')[0]+","}</Text>
                    <Heading size="7">{organizationData.name}</Heading>
                    <Button>menu</Button>
                </Box>
                <Box className="collection" style={{background: 'var(--gray-a3)'}}>
                    <Box p={"2"}>
                        <Text>Overview</Text>
                    </Box>
                    <Box p={"1"}>
                        <Text>Items</Text>
                    </Box>
                </Box>
            </Container>
    )
}