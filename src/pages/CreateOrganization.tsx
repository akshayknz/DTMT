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
                    <textarea autoFocus style={{
                        fontSize: "30px",
                        boxShadow: "rgb(0 0 0 / 57%) 0px 2px 0px -1px",
                        margin: "25px 0px",
                        width: "100%",
                        background: "transparent",
                        border: "none",
                        color:"#000",
                        boxSizing:"border-box"
                    }}></textarea>
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