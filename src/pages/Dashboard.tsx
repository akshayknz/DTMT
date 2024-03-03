import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  IconButton,
  Text,
} from "@radix-ui/themes";
import Navbar from "../components/Navbar";
import Collection from "../components/Collection";
import {
  RiAddBoxFill,
  RiAddCircleFill,
  RiDeleteBin7Line,
  RiMore2Fill,
} from "react-icons/ri";
import background from "../assets/background.jpg";
import { Link, Outlet, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { changeOrganizationStatus, getOrganizations } from "../db";
import { AuthContext } from "../context/AuthContext";
import {
  OrganizationProps,
  PageStatus,
  UserOrganizationProps,
} from "../interfaces/interfaces";
export default function Dashboard() {
  const { userId } = useContext(AuthContext);
  const params = useParams();
  const [organizations, setOrganizations] = useState(
    [] as UserOrganizationProps[]
  );

  useEffect(() => {
    getAllOrganizations();
  }, []);

  const getAllOrganizations = async () => {
    setOrganizations(await getOrganizations(userId));
  };
  const deleteOrganization = async (slug) => {
    changeOrganizationStatus(slug, userId, PageStatus.DELETED);
    getAllOrganizations();
  };
  return (
    <>
      {params.id ? (
        <Outlet />
      ) : (
        <Container px="3">
          <Box pt={"6"} pb={"5"}>
            <Heading size="7">To start create an organization.</Heading>
          </Box>
          <Box>
            <Link to="/create-organization">
              <Button>
                <RiAddCircleFill width="16" height="16" /> Create Organization
              </Button>
            </Link>
            {organizations.map((v) => (
              <Card style={{ margin: "10px 0px" }} key={v.id}>
                <Flex gap="3" align="center">
                  <Link
                    to={`org/${v.slug}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Flex gap="3" align="center">
                      <Box>
                        <Text as="div" size="2" weight="bold">
                          {v.name}
                        </Text>
                        <Text as="div" size="2" color="gray">
                          Engineering
                        </Text>
                      </Box>
                      <Flex gap="2">
                        <Avatar
                          variant="solid"
                        src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
                        color="orange"
                          fallback="A"
                          radius="large"
                        />
                        <Avatar
                          variant="solid"
                          color="indigo"src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
    
                          radius="large"
                          fallback="A"
                          style={{ marginLeft: "-30px" }}
                        />
                      </Flex>
                    </Flex>
                  </Link>

                  <Box>
                    <Flex align="center" gap="3">
                      <IconButton
                        size="3"
                        variant="soft"
                        onClick={() => deleteOrganization(v.slug)}
                      >
                        <RiDeleteBin7Line />
                      </IconButton>

                      <IconButton
                        size="3"
                        variant="soft"
                        onClick={() => deleteOrganization(v.slug)}
                      >
                        <RiMore2Fill />
                      </IconButton>
                    </Flex>
                  </Box>
                </Flex>
              </Card>
            ))}
          </Box>
        </Container>
      )}
    </>
  );
}
