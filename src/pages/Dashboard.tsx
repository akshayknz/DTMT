import { Box, Container, Heading } from "@radix-ui/themes";
import Navbar from "../components/Navbar";
import Collection from "../components/Collection";

const Dashboard = () => {
    return(
        <>
        <Navbar/>
        <Box pt={"6"} pb={"5"}>
        <Heading size="9">Todays time.</Heading>
            
            </Box>
            <Container>
                <Collection/>
            </Container>
        </>
    )
}
export default Dashboard;