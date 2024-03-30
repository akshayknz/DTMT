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
import Loading from "../components/Loading";
export default function Dashboard() {
  const { userId } = useContext(AuthContext);
  const params = useParams();
  const [organizations, setOrganizations] = useState(
    [] as UserOrganizationProps[]
  );
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllOrganizations();
  }, []);

  const getAllOrganizations = async () => {
    
    setOrganizations(await getOrganizations(userId));
    setLoading(false)
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
        <>{loading?<>
        <Loading></Loading>
          </>:
        <Container px="3">
          {organizations.length===0 ? 
          <Box>
          <Box pt={"6"} pb={"5"}>
            <Heading size="7">To start create an organization.</Heading>
          </Box>
          <Box pb={"4"}>
            <Link to="/create-organization">
              <Button>
                <RiAddCircleFill width="16" height="16" /> Create Organization
              </Button>
            </Link>
          </Box>
        </Box>:
          <Box pt={"3"} pb={"2"}>
            <Heading size="7">Your organizations.</Heading>
          </Box>
          }
          
          <Box>
            {organizations.map((v) => (
              <Card style={{ margin: "10px 0px" }} key={v.id}>
                        <Flex align="center" gap="3" justify={"between"}>
                <Text as="div" size="2" color="gray" >
                          13 items
                        </Text>
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
                    </Flex>
                <Flex  gap="3"  direction={"column"}>
                  <Link
                    to={`org/${v.slug}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Flex gap="3" align="center">
                      <Box>
                        <Heading weight="bold">
                          {v.name}
                        </Heading>
                        
                      </Box>
                      
                    </Flex>
                  </Link>
                  <Flex gap="2">
                  <Avatar
                          variant="solid"
                          color="red"
                          radius="large"
                          fallback="A"
                          style={{transform:"scale(.7)"}}
                        />
                  <Avatar
                          variant="solid"
                          color="indigo"
                          radius="large"
                          fallback="A"
                          style={{transform:"scale(.8)", marginLeft: "-40px"}}
                        />
                        <Avatar
                          variant="solid"
                          color="orange"
                          fallback="A"
                          radius="large"
                          style={{transform:"scale(.9)", marginLeft: "-40px"}}
                        />
                        <Avatar
                          variant="solid"
                          color="indigo"
                          radius="large"
                          fallback="A"
                          style={{ marginLeft: "-40px", zIndex:1 }}
                        />
                      </Flex>
                  <Box>
                    
                  </Box>
                </Flex>
              </Card>
            ))}
          </Box>
      
        </Container>}</>
      )}
    </>
  );
}
