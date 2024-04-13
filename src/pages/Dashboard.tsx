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
import { GoArrowUpRight, GoGear, GoGrabber, GoKebabHorizontal } from "react-icons/go";
export default function Dashboard() {
  const { userId } = useContext(AuthContext);
  const params = useParams();
  const [organizations, setOrganizations] = useState(
    [] as UserOrganizationProps[]
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllOrganizations();
  }, []);

  const getAllOrganizations = async () => {
    setOrganizations(await getOrganizations(userId));
    setLoading(false);
  };
  const deleteOrganization = async (e,slug) => {
    e.preventDefault()
    changeOrganizationStatus(slug, userId, PageStatus.DELETED);
    getAllOrganizations();
  };
  return (
    <>
      {params.id ? (
        <Outlet />
      ) : (
        <>
          {loading ? (
            <>
              <Loading></Loading>
            </>
          ) : (
            <Container px="3">
              {organizations.length === 0 ? (
                <Box>
                  <Box pt={"6"} pb={"5"}>
                    <Heading size="7">To start create an organization.</Heading>
                  </Box>
                  <Box pb={"4"}>
                    <Link to="/create-organization">
                      <Button>
                        <RiAddCircleFill width="16" height="16" /> Create
                        Organization
                      </Button>
                    </Link>
                  </Box>
                </Box>
              ) : (
                <Box pb={"2"}>
                  <Heading size="7" weight={"medium"}>Your organizations</Heading>
                </Box>
              )}

              <Box style={{marginBottom:"130px"}}>
                {organizations.map((v,i) => (
                  <Link to={`org/${v.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }} key={v.id}
                >
                  <Box
                    style={{
                      margin: "15px 0px 15px 0",
                      borderRadius: "16px",
                      padding: "22px 16px",
                      background:"#e7ffec",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div className="org-back-letter">{v.name.substring(0,3)}</div>
                    <Flex align="start" gap="3" justify={"between"}>
                      <Box style={{width:"57%"}}>
                        <Text as="div" size="1" color="gray">
                          13 items
                        </Text>
                        
                          <Box mb="6" mt="1">
                            <Heading weight={"medium"} >{v.name}</Heading>
                          </Box>
                      </Box>
                      <Box
                          className="btn btn-secondary"
                          onClick={(e) => deleteOrganization(e,v.slug)}
                        >
                          <GoKebabHorizontal />
                        </Box>
                        <Box
                          className="btn"
                          onClick={(e) => deleteOrganization(e,v.slug)}
                        >
                          <GoArrowUpRight  />
                        </Box>
                    </Flex>
                    <Flex gap="3" direction={"row"} align={"center"}>
                    <Text size="1" color="gray">
                       Members: 
                       </Text>
                      <Flex gap="2" className="avatar-group">
                        <Avatar radius="full" fallback="A" size={"2"} variant="solid" />
                        <Avatar radius="full" fallback="B" size={"2"} variant="solid" />
                        <Avatar size={"2"} variant="solid" fallback="C" radius="full" />
                        <Avatar size={"2"} variant="solid" radius="full" fallback="+3" style={{ zIndex: 1 }} />
                      </Flex>
                      <Box></Box>
                    </Flex>
                  </Box>
                  </Link>
                ))}
              </Box>
            </Container>
          )}
        </>
      )}
    </>
  );
}
