import { Box, Button, Container, Heading, Text } from "@radix-ui/themes";
import Navbar from "../components/Navbar";
import Collection from "../components/Collection";
import { RiAddBoxFill, RiAddCircleFill } from "react-icons/ri";
import background from "../assets/background.jpg";
import { Link, Outlet, useParams } from "react-router-dom";
export default function Dashboard() {
    const params = useParams();

    return (
        <>
            {params.id?<Outlet/>:<Container px="3">
                <Box pt={"6"} pb={"5"}>
                    <Heading size="7">To start create an organization.</Heading>
                </Box>
                <Box>
                    <Link to="/create-organization">
                    <Button>
                        <RiAddCircleFill width="16" height="16" /> Create Organization
                    </Button>
                    </Link>
                    <Link to="/org/dsrgsdfg">
                    <Box>
                One from list
            </Box></Link>
            <Box>
                One from list
            </Box>
            <Box>
                One from list
            </Box>
                </Box>
            </Container>}
            
        </>
    )
}