import { Box, Button, Container, Heading, Text } from "@radix-ui/themes";
import Navbar from "../components/Navbar";
import Collection from "../components/Collection";
import { RiAddBoxFill, RiAddCircleFill } from "react-icons/ri";
import background from "../assets/background.jpg";
import { Link } from "react-router-dom";
export function Component() {
    return (
        <>
            
            <Container px="3">
                <Box pt={"6"} pb={"5"}>
                    <Heading size="7">To start create an organization.</Heading>
                </Box>
                <Box>
                    <Link to="/create-organization">
                    <Button>
                        <RiAddCircleFill width="16" height="16" /> Create Organization
                    </Button>
                    </Link>
                    
                </Box>
            </Container>
        </>
    )
}