import { Box, Button, Container, Heading, Text, TextArea, TextField } from "@radix-ui/themes";
import Navbar from "../components/Navbar";
import Collection from "../components/Collection";
import { RiAddBoxFill, RiAddCircleFill } from "react-icons/ri";
import background from "../assets/background.jpg";
import { Link } from "react-router-dom";
export function Component() {
    return (
        <>
            <Container px="3">
                <Link to=".." relative="path">
                    <Button>
                        Go back
                    </Button>
                </Link>
                <Box>
                <Box py={"3"}>
                    <textarea style={{
                        background:"transparent",
                        border:"none",
                        width:"100%",
                        color:"#000",
                    }}></textarea>
                </Box>
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