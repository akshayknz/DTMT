import { Box, Button, Container, Heading, Text, TextArea, TextField } from "@radix-ui/themes";
import Navbar from "../components/Navbar";
import Collection from "../components/Collection";
import { RiAddBoxFill, RiAddCircleFill } from "react-icons/ri";
import background from "../assets/background.jpg";
import { Link } from "react-router-dom";
import { saveOrganization, textToUrl } from "../db";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export function Component() {
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const { userId } = useContext(AuthContext)
    const getUserId = () => {
        return userId
    }
    useEffect(() => {
        /**
         * IIFE
         * An IIFE (Immediately Invoked Function Expression) is a JavaScript 
         * function that runs as soon as it is defined.
         */
        (async () => {
            let url = await textToUrl(name, userId);
            setUrl(url)
        })();
    
        return () => {};
    }, [name, userId]);

    return (
        <Container px="3">
            <Link to=".." relative="path">
                <Button>
                    Go back
                </Button>
            </Link>
            <Box>
                <Box py={"6"}>
                    <textarea value={name} onChange={(e)=>setName(e.target.value)} autoFocus style={{
                        background: "transparent",
                        border: "none",
                        width: "100%",
                        color: "#000",
                        fontSize: "30px",
                        resize: "none"
                    }}></textarea>
                    /{url}
                </Box>
            </Box>
            <Box>
                <Button onClick={()=>saveOrganization({name:name,"id":getUserId()})}>
                    Create Organization
                </Button>
            </Box>
        </Container>
    )
}