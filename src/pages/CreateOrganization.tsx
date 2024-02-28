import { Box, Button, Container, Heading, Text, TextArea, TextField } from "@radix-ui/themes";
import Navbar from "../components/Navbar";
import Collection from "../components/Collection";
import { RiAddBoxFill, RiAddCircleFill } from "react-icons/ri";
import background from "../assets/background.jpg";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { saveUserOrganization, textToUrl } from "../db";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { UserOrganizationProps } from "../interfaces/interfaces";

export function Component() {
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const { userId } = useContext(AuthContext)
    const navigate = useNavigate();

    useEffect(() => {
        /**
         * IIFE
         * An IIFE (Immediately Invoked Function Expression) is a JavaScript 
         * function that runs as soon as it is defined.
         */
        (async () => {
            let url = await textToUrl(name, userId, "Organization");
            setUrl(url)
        })();
    
        return () => {};
    }, [name, userId]);
    
    const handleSubmit = async () => {
        let organization : UserOrganizationProps = await saveUserOrganization({
            name:name,
            id:userId, 
            selected: true
        });
        navigate(`/org/${organization.slug}`)
    }

    return (
        <Container px="3">
                <Button onClick={() => navigate(-1)}>
                    Go back
                </Button>
            <Box>
                <Box py={"6"}>
                    <textarea value={name} onChange={(e)=>setName(e.target.value)} autoFocus style={{
                        background: "transparent",
                        border: "none",
                        width: "100%",
                        display:"block",
                        boxSizing:"border-box",
                        color: "#000",
                        fontSize: "30px",
                        resize: "none"
                    }}></textarea>
                    /{url}
                </Box>
            </Box>
            <Box>
                <Button onClick={handleSubmit}>
                    Create Organization
                </Button>
            </Box>
            
        </Container>
    )
}