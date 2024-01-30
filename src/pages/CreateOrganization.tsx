import { Box, Button, Container, Heading, Text } from "@radix-ui/themes";
import Navbar from "../components/Navbar";
import Collection from "../components/Collection";
import { RiAddBoxFill, RiAddCircleFill } from "react-icons/ri";
import background from "../assets/background.jpg";
export default function CreateOrganizatoin(): JSX.Element {
    return (
        <>
            <Navbar />
            <Container px="6" style={{height: "60vh", background:`url("${background}")`}}>
                <Box pt={"6"} pb={"5"}>
                </Box>
                <Box>
                    <Button>
                        <RiAddCircleFill width="16" height="16" /> Bookmark
                    </Button>
                </Box>
            </Container>
        </>
    )
}