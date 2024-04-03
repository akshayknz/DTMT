import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import Navbar from "../components/Navbar";
import Collection from "../components/Collection";
import { RiAddBoxFill, RiAddCircleFill } from "react-icons/ri";
import background from "../assets/background.jpg";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { saveUserOrganization, textToUrl } from "../db";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { PageStatus, UserOrganizationProps } from "../interfaces/interfaces";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../context/store";
import { saveUserOrganizationThunk, setCreateOrgName } from "../context/appSlice";

export function Component() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const createOrgName = useSelector((state: RootState) => state.app.createOrgName);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    /**
     * IIFE
     * An IIFE (Immediately Invoked Function Expression) is a JavaScript
     * function that runs as soon as it is defined.
     */
    (async () => {
      let url = await textToUrl(name, userId, "Organization");
      setUrl(url);
    })();

    return () => {};
  }, [name, userId]);

  const handleSubmit = async () => {
    let organization: UserOrganizationProps = await saveUserOrganization({
      orgData: {
        name: name,
        id: userId,
        selected: true,
        status: PageStatus.ACTIVE,
      },
      userId,
    });
    console.log(organization);

    navigate(`/dashboard/org/${organization.slug}`);
  };

  return (
    <Container px="3">
      <Box>
        <Box py={"6"}>
          <textarea
            value={createOrgName}
            onChange={(e) => dispatch(setCreateOrgName(e.target.value))}
            autoFocus
            style={{
              background: "transparent",
              border: "none",
              width: "100%",
              display: "block",
              boxSizing: "border-box",
              color: "#000",
              fontSize: "30px",
              resize: "none",
            }}
          ></textarea>
          /{url}
        </Box>
      </Box>
      <Box>
        <Button onClick={handleSubmit}>Create Organization</Button>
      </Box>
      <button onClick={() => dispatch(saveUserOrganizationThunk())}>-</button>
    </Container>
  );
}
