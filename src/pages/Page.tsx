import { AlertDialog, Box, Button, Card, Container, Flex, Heading, Text, TextArea, TextField } from "@radix-ui/themes";
import { RiAddCircleFill } from "react-icons/ri";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { getPage, savePage } from "../db";
export function Component() {
    const params = useParams();
    const [name, setName] = useState("");
    const [id, setId] = useState("");
    const [body, setBody] = useState({} as { [key: string]: string });
    const { userId } = useContext(AuthContext)
    const navigate = useNavigate();

    useEffect(() => {
        if (params.id) {
            getPage(params.id, userId).then(v => {
                setName(v.name)
                // setBody(v.body) get id[], then get element data and out id:data
                setId(v.id)
            })
        }
    }, [])

    const handleSavePage = () => {
        const page = savePage({
            name: name,
            body: [],
            id: id
        }, userId).then(v => {
            setId(v.id)
            navigate(`/page/${v.slug}`)
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
                            <RiAddCircleFill width="16" height="16" /> Save
                        </Button>
                    </Flex>
                </Box>
                <Box pb={"3"}>
                    <TextField.Input size="3" placeholder="New Page" autoFocus value={name} onChange={(v) => setName(v.target.value)} />
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