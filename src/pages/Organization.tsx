import { Box, Container, Heading, Text } from "@radix-ui/themes";
import { useParams } from "react-router-dom";
import { getOrg } from "../db";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
export function Component() {
    const params = useParams();
    const { userId } = useContext(AuthContext)
    const slug = params.id;
    console.log(getOrg(slug, userId));
    
    return (
        <>
            {slug}
            <Container px="3">
                <Box pt={"6"} pb={"5"}>
                    <Heading size="7">{slug}</Heading>
                </Box>
            </Container>
        </>
    )
}