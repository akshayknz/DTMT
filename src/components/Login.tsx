import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Box, Button, Container, Flex, Heading } from '@radix-ui/themes';
import { RiGoogleFill } from "react-icons/ri";
import { Navigate, useNavigate } from 'react-router-dom';
import Loading from './Loading';

const Login = () => {
    const { handleLoginWithGoogle } = useContext(AuthContext)
    const navigate = useNavigate();
    const { userId, status } = useContext(AuthContext)

    if((status === 'checking')) { //loading screen while auth==checking
        return <Loading />;
    }

    if((status === 'authenticated' && userId)) { //redirect to dashboard if auth==authenticated
        return <Navigate to="/dashboard"  replace />;
    }

    return ( //show if auth==not authenticated
            <Box >
                <Container size="1">
                <Flex gap="2" align="center">
                    <Box style={{paddingBlock:"50%"}}></Box>
                    <Box>
                    <Heading size="7" weight={"light"}>Login to DeckHouse to access your account.</Heading>
                    <Box style={{paddingBlock:"3%"}}></Box>
                    <Button variant="solid" radius="full" size="3" type="button" onClick={()=>{
                        handleLoginWithGoogle();
                        navigate("/dashboard")
                    }}
                    style={{width:"100%"}} color='green'>
                        <RiGoogleFill size="23" />Login with Google
                    </Button>
                    </Box>
                    <Box style={{paddingBlock:"50%"}}></Box>
                    </Flex>
                </Container>
            </Box>
    )
}
export default Login;