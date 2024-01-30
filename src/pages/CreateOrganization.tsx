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
                <Link to=".." relative="path">
                    <Button>
                        Go back
                    </Button>
                </Link>
                <Box>
                    <div contentEditable style={{
                        fontSize: "30px",
                        boxShadow: "0px 3px 0 -1px #000",
                        margin: "25px 0px",
                    }}></div>
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