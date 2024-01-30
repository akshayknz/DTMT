import { Box, Button, Container, Heading, Text } from "@radix-ui/themes";
import Navbar from "../components/Navbar";
import Collection from "../components/Collection";
import { RiAddBoxFill, RiAddCircleFill } from "react-icons/ri";
import background from "../assets/background.jpg";
export function Component() {
    return (
        <>
            <Container px="6" style={{height: "60vh", background:`url("${background}")`}}>
                <Box pt={"6"} pb={"5"}>
                </Box>
                <Box>
                    <Button>
                        Create Organization
                    </Button>
                </Box>
            </Container>
        </>
    )
}