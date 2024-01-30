// import { useForm } from '../hooks/useForm';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Avatar, Box, Button, Container, Flex, Heading, Text } from '@radix-ui/themes';
import logo from '../assets/logo.png';
import { RiGoogleFill } from "react-icons/ri";

const Login = () => {

    // const { handleLoginWithGoogle, handleLoginWithCredentials } = useContext(AuthContext)
    const { handleLoginWithGoogle } = useContext(AuthContext)

    // const { handleChange, pass, email } = useForm({
    //     initialState: {
    //         email: 'test@test1.com',
    //         pass: '123456'
    //     }
    // })

    // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault()
    //     handleLoginWithCredentials(pass, email)
    // }

    return (
        <>
            {/* <div className="container-auth">
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <TextField.Input name="email"
                    type="email"
                    placeholder="E-mail"
                    onChange={handleChange}
                    value={email} />
                <TextField.Input name="pass"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={pass} />
                <Flex gap="3" align="center">
                    <Button variant="soft"  type="submit">
                        Login
                    </Button>
                    <Button variant="soft"  type="button" onClick={handleLoginWithGoogle}>
                        Google
                    </Button>
                </Flex>
            </form>
        </div> */}
            <Box >
                <Container size="1">
                <Flex gap="2" align="center">
                    <Box style={{paddingBlock:"50%"}}></Box>
                    <Box>
                    <Heading size="7" weight={"light"}>Login to DeckHouse to access your account.</Heading>
                    <Box style={{paddingBlock:"3%"}}></Box>
                    <Button variant="solid" radius="full" size="3" type="button" onClick={handleLoginWithGoogle}
                    style={{width:"100%"}} color='green'>
                        <RiGoogleFill size="23" />Login with Google
                    </Button>
                    </Box>
                    <Box style={{paddingBlock:"50%"}}></Box>
                    </Flex>
                </Container>
            </Box>

        </>
    )
}
export default Login;