import { Box, Button, Container, Heading, Text } from "@radix-ui/themes";
import Navbar from "../components/Navbar";
import Collection from "../components/Collection";
import { RiAddBoxFill, RiAddCircleFill } from "react-icons/ri";
import background from "../assets/background.jpg";
export function Component() {
    return (
        <>
            <Container px="6">
                
                <Box>
                    <Button>
                        Create Organization
                    </Button>
                </Box>
            </Container>
        </>
    )
}