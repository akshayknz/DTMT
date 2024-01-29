import { useForm } from '../hooks/useForm';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Avatar, Box, Button, Container, Flex, Text } from '@radix-ui/themes';
import logo from '../assets/logo.png';
export const Login = () => {

    const { handleLoginWithGoogle, handleLoginWithCredentials } = useContext(AuthContext)

    const { handleChange, pass, email } = useForm({
        initialState: {
            email: 'test@test1.com',
            pass: '123456'
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        handleLoginWithCredentials(pass, email)
    }

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
        <Box style={{ background: 'var(--gray-a2)', borderRadius: 'var(--radius-3)' }}>
                <Container size="1">
                <Flex gap="2" align="center">
  <Avatar
    src={logo} size="2"
    fallback="A"
  />
  <Text>DeckHouse</Text>
</Flex>
                </Container>
            </Box>
            <Box style={{ background: 'var(--gray-a2)', borderRadius: 'var(--radius-3)' }}>
                <Container size="1">
                    <Box py="9" />
                    <Button variant="soft" type="button" onClick={handleLoginWithGoogle}>
                        Google
                    </Button>
                </Container>
            </Box>

        </>
    )
}