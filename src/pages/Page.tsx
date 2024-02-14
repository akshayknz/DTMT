import { AlertDialog, Box, Button, Card, Container, Flex, Heading, Text, TextArea, TextField } from "@radix-ui/themes";
import Navbar from "../components/Navbar";
import Collection from "../components/Collection";
import { RiAddBoxFill, RiAddCircleFill } from "react-icons/ri";
import background from "../assets/background.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { savePage } from "../db";
export function Component() {
    const [name, setName] = useState("");
    const [id, setId] = useState("");
    const [body, setBody] = useState({} as {[key: string]: string});
    const { userId } = useContext(AuthContext)
    const navigate = useNavigate();
    const handleSavePage = () => {
        const page = savePage({
            name: name,
            body: [],
            id:id
        }, userId).then(v=>{
            console.log(v);
            
            // navigate(`/page/${v.slug}`)            
        });
    }
    return (
        <>
            <Container px="3" pb={"5"}>
                <Box pb={"3"}>
                    <Flex gap={"3"}>
                        <Link to="..">
                            <Button>
                                Cancel
                            </Button>
                        </Link>
                        <Button onClick={handleSavePage}>
                            <RiAddCircleFill width="16" height="16"/> Save
                        </Button>
                    </Flex>
                </Box>
                <Box pb={"3"}>
                    <TextField.Input size="3" placeholder="New Page" autoFocus value={name} onChange={(v)=>setName(v.target.value)}/>
                </Box>
                <Box pb={"3"}>
                    <Text>Add a body block</Text>
                </Box>
                <Box pb={"3"}>
                    <Text>Add a To-do block</Text>
                </Box>
                <Box pb={"3"}>
                    <Text>Add a Link block</Text>
                </Box>
                <Box pb={"3"}>
                    <AlertDialog.Root>
                        <AlertDialog.Trigger>
                            <Button style={{ width: "100%", fontWeight: "400" }} size="3" >
                                <RiAddCircleFill width="16" height="16" /> Add a block
                            </Button>
                        </AlertDialog.Trigger>
                        <AlertDialog.Content style={{ maxWidth: 450 }}>
                            <AlertDialog.Title>Add a block</AlertDialog.Title>
                            <Flex direction={"column"}>
                                <AlertDialog.Action>
                                    <Card my={"1"}>
                                        <Text as="div" size="2" weight="bold"> Body </Text>
                                        <Text as="div" color="gray" size="2">
                                            A body element that holds text.
                                        </Text>
                                    </Card>
                                </AlertDialog.Action>
                                <AlertDialog.Action>
                                    <Card my={"1"}>
                                        <Text as="div" size="2" weight="bold"> To Do </Text>
                                    </Card>
                                </AlertDialog.Action>
                                <AlertDialog.Action>
                                    <Card my={"1"}>
                                        <Text as="div" size="2" weight="bold"> Links </Text>
                                    </Card>
                                </AlertDialog.Action>
                            </Flex>
                        </AlertDialog.Content>
                    </AlertDialog.Root>

                </Box>
            </Container>
        </>
    )
}