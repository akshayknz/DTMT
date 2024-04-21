import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Dialog,
  DropdownMenu,
  Flex,
  Heading,
  Switch,
  Table,
  Text,
  
  TextField,
} from "@radix-ui/themes";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  addEmailToShareList,
  getAllAPIConnections,
  getOrganizaionUsers,
  getOrganization,
  getPages,
  getUser,
} from "../db";
import { CSSProperties, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  OrganizationProps,
  PageProps,
  UserProps,
} from "../interfaces/interfaces";
import { RiAddFill, RiMore2Fill, RiSearchLine } from "react-icons/ri";
import { Masonry } from "react-masonry/dist";
import Block from "../components/Block";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { IoAddCircleOutline } from "react-icons/io5";
import { ApiSettingsBlock } from "../components/ApiSettingsBlock";
export function Component() {
  const navigate = useNavigate();
  const params = useParams();
  let location = useLocation();
  const [user, setUser] = useState({} as UserProps);
  const [organizationData, setOrganizationData] = useState(
    {} as OrganizationProps
  );
  const [pages, setPages] = useState({} as { [key: string]: PageProps });
  const { userId } = useContext(AuthContext);
  const nameSettingsRef = useRef(null);
  const peopleSettingsRef = useRef(null);
  const [shareEmail, setShareEmail] = useState("");
  useEffect(() => {
    getUser(userId).then((v) => setUser(v as UserProps));
    getOrganization(params.id, userId).then((v) => setOrganizationData(v));
  }, []);
  useEffect(() => {
    getPageList(userId);
    scrollTo(peopleSettingsRef);
  }, [location]);
  useEffect(() => {
    /**
     * TODO
     * Get share list to display in table of shared accounts
     */
    getOrganizaionUsers(params.id, userId);
  }, [shareEmail]);
  const height = 120;
  const getPageList = async (userId) => {
    const pageList = await getPages(params.id, userId);
    setPages(pageList);
    return pageList;
  };
  const scrollTo = (ref) =>
    ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
  const submitEmail = () => {
    if (/\S+@\S+\.\S+/.test(shareEmail)) {
      addEmailToShareList(shareEmail, userId, params.id).then(() =>
        alert("Success")
      );
      setShareEmail("");
    }
  };

  const [apiConnections, setApiConnections] = useState([]);

  useEffect(() => {
    const fetchApiConnections = async () => {
      const connections = await getAllAPIConnections(userId, params.id);
      setApiConnections(connections);
    };

    fetchApiConnections();
  }, []);

  return (
    <>
      <Container px="3">
        <Box mb="8">
          <Heading mb="3" ref={nameSettingsRef}>
            Organization Name
          </Heading>
          <TextField.Input
            mb="3"
            placeholder="Organization Name"
          ></TextField.Input>
          <Button>Save</Button>
        </Box>
        <Box mb="8">
          <Heading mb="3" ref={peopleSettingsRef}>
            People in this organization
          </Heading>
          <Table.Root mb="3">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>State</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.RowHeaderCell>
                  <Checkbox></Checkbox>
                </Table.RowHeaderCell>
                <Table.Cell>danilo@example.com</Table.Cell>
                <Table.Cell>
                  <Button>...</Button>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
          <TextField.Input
            mb="3"
            placeholder="Enter email"
            value={shareEmail}
            onChange={(v) => setShareEmail(v.target.value)}
          ></TextField.Input>
          <Button onClick={submitEmail}>Share</Button>
        </Box>
        <Box mb="8">
          <Heading mb="3">
            Connect APIs
          </Heading>
          {apiConnections.map((apiConnection) => (
          <ApiSettingsBlock key={apiConnection.id} apiConnection={apiConnection} setApiConnection={setApiConnections} />
        ))}
        <Button mt={"4"} onClick={() => setApiConnections([...apiConnections, { id: null, name: "", endpoint: "", body: "", take: 0 }])}>
          <IoAddCircleOutline /> Connect a new API
        </Button>
          <Button mt={"4"}>
            <IoAddCircleOutline /> Connect a new API
          </Button>
        </Box>
      </Container>
    </>
  );
}
