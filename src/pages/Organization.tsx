import { Box, Button, Card, Container, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import { useParams } from "react-router-dom";
import { getOrganization, getUser } from "../db";
import { CSSProperties, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { OrganizationProps, UserProps } from "../interfaces/interfaces";
import { RiAddFill, RiMore2Fill, RiSearchLine } from "react-icons/ri";
import { Masonry } from "react-masonry/dist";
export function Component() {
    const params = useParams();
    const [user, setUser] = useState({} as UserProps)
    const [organizationData, setOrganizationData] = useState({} as OrganizationProps)
    const { userId } = useContext(AuthContext)
    useEffect(() => {
        getUser(userId).then(v => setUser(v as UserProps))
        getOrganization(params.id, userId).then(v => setOrganizationData(v))
    }, [])
    const height = 120

    return (
        <Container px="3">
            <Box pt={"2"} pb={"3"}>
                <Text>Hi {user.displayName && user.displayName.split(' ')[0] + ","}</Text>
                <Flex gap="3" align="center" justify="between">
                    <Heading size="7" weight={"medium"}>{organizationData.name}</Heading>
                    {/**
                     * TODO: Show input field when Search button is clicked.
                     * - Creat a state (bool).
                     * - Onclick toggle.
                     * - Show on true.
                     * - Font should be as big as the Heading.
                     * 
                     *  */ }
                    <Button variant="soft" size="4" radius="small"><RiSearchLine /></Button>
                    {/* <TextField.Root>
                            <TextField.Input variant="soft" placeholder="Search the docs…" size="2" />
                        </TextField.Root> */}
                </Flex>
            </Box>
            <Box className="collection" mb={"2"} >
                <Box p={"2"}>
                    <Flex justify={"between"} align={"center"}>
                        <Text weight={"medium"}>Overview (Collection)</Text>
                        <Flex>
                            <Button variant="soft" size="4" mx={"1"}><RiAddFill /></Button>
                            <Button variant="soft" size="4" mx={"1"}><RiMore2Fill /></Button>

                        </Flex>
                    </Flex>
                </Box>
                <Masonry>
                    <Box style={{ width: '70%' }}>
                        <Box px={"3"} p={"1"} style={{ margin: "4px", background: "#DB3A34", height, borderRadius: "4px", color: "#fff" }}>
                            <Box>
                                <Text size="1">Page 1 (Pages)</Text>
                                <Box width={"auto"} p={"1"}>
                                    <Text m={"1"} size="1" >Page body (Content)</Text>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box style={{ width: '30%' }}>
                        <Box px={"3"} p={"1"} style={{ margin: "4px", background: "#333333", height, borderRadius: "4px", color: "#fff" }}>
                            <Box>
                                <Box width={"auto"} p={"1"}>
                                    <Text m={"1"} size="1" >Page body (Content)</Text>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box style={{ width: '50%' }}>
                        <Box px={"3"} p={"1"} style={{ margin: "4px", background: "#E3F2FD", height, borderRadius: "4px", color: "#000" }}>
                            <Box>
                                <Text size="1">Page 1 (Pages)</Text>
                                <Box width={"auto"} p={"1"}>
                                    <Text m={"1"} size="1" >Page body (Content)</Text>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box style={{ width: '50%' }}>
                        <Box px={"3"} p={"1"} style={{ margin: "4px", background: "#FFCA3A", height, borderRadius: "4px", color: "#000" }}>
                            <Box>
                                <Text size="1">Page 1 (Pages)</Text>
                                <Box width={"auto"} p={"1"}>
                                    <Text m={"1"} size="1" >Page body (Content)</Text>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box style={{ width: '100%' }}>
                        <Box px={"3"} p={"1"} style={{ margin: "4px", background: "#00CC66", height:"200px", borderRadius: "4px", color: "#fff" }}>
                            <Box>
                                <Text size="1">Page 1 (Pages)</Text>
                                <Box width={"auto"} p={"1"}>
                                    <Text m={"1"} size="1" >Page body (Content)</Text>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Masonry>
                <Box pb={"1"}></Box>
            </Box>
            <Box className="collection" mb={"2"} >
                <Box p={"2"}>
                    <Flex justify={"between"} align={"center"}>
                        <Text weight={"medium"}>Overview (Collection)</Text>
                        <Flex>
                            <Button variant="soft" size="4" mx={"1"}><RiAddFill /></Button>
                            <Button variant="soft" size="4" mx={"1"}><RiMore2Fill /></Button>

                        </Flex>
                    </Flex>
                </Box>
                <Masonry>
                    <Box style={{ width: '70%' }}>
                        <Box px={"3"} p={"1"} style={{ margin: "4px", background: "#DB3A34", height, borderRadius: "4px", color: "#fff" }}>
                            <Box>
                                <Text size="1">Page 1 (Pages)</Text>
                                <Box width={"auto"} p={"1"}>
                                    <Text m={"1"} size="1" >Page body (Content)</Text>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box style={{ width: '30%' }}>
                        <Box px={"3"} p={"1"} style={{ margin: "4px", background: "#333333", height, borderRadius: "4px", color: "#fff" }}>
                            <Box>
                                <Box width={"auto"} p={"1"}>
                                    <Text m={"1"} size="1" >Page body (Content)</Text>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box style={{ width: '50%' }}>
                        <Box px={"3"} p={"1"} style={{ margin: "4px", background: "#E3F2FD", height, borderRadius: "4px", color: "#000" }}>
                            <Box>
                                <Text size="1">Page 1 (Pages)</Text>
                                <Box width={"auto"} p={"1"}>
                                    <Text m={"1"} size="1" >Page body (Content)</Text>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box style={{ width: '50%' }}>
                        <Box px={"3"} p={"1"} style={{ margin: "4px", background: "#FFCA3A", height, borderRadius: "4px", color: "#000" }}>
                            <Box>
                                <Text size="1">Page 1 (Pages)</Text>
                                <Box width={"auto"} p={"1"}>
                                    <Text m={"1"} size="1" >Page body (Content)</Text>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box style={{ width: '100%' }}>
                        <Box px={"3"} p={"1"} style={{ margin: "4px", background: "#00CC66", height, borderRadius: "4px", color: "#fff" }}>
                            <Box>
                                <Text size="1">Page 1 (Pages)</Text>
                                <Box width={"auto"} p={"1"}>
                                    <Text m={"1"} size="1" >Page body (Content)</Text>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Masonry>
                <Box pb={"1"}></Box>
            </Box>
            <Masonry style={{width:"10vw", overflow:"hidden"}}>
                <Box style={{ width: '100%' }}>
                    <Box px={"3"} p={"1"} style={{ margin: "4px", background: "#E3F2FD", height, borderRadius: "4px", color: "#000" }}>
                        <Box>
                            <Text size="1">Page 1 (Pages)</Text>
                            <Box width={"auto"} p={"1"}>
                                <Text m={"1"} size="1" >Page body (Content)</Text>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box style={{ width: '100%' }}>
                    <Box px={"3"} p={"1"} style={{ margin: "4px", background: "#E3F2FD", height, borderRadius: "4px", color: "#000" }}>
                        <Box>
                            <Text size="1">Page 1 (Pages)</Text>
                            <Box width={"auto"} p={"1"}>
                                <Text m={"1"} size="1" >Page body (Content)</Text>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box style={{ width: '100%' }}>
                    <Box px={"3"} p={"1"} style={{ margin: "4px", background: "#E3F2FD", height, borderRadius: "4px", color: "#000" }}>
                        <Box>
                            <Text size="1">Page 1 (Pages)</Text>
                            <Box width={"auto"} p={"1"}>
                                <Text m={"1"} size="1" >Page body (Content)</Text>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Masonry>

        </Container>
    )
}
