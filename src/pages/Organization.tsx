import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DropdownMenu,
  Flex,
  Heading,
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
import { getOrganization, getPages, getUser } from "../db";
import { CSSProperties, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  OrganizationProps,
  PageProps,
  UserProps,
} from "../interfaces/interfaces";
import { RiAddFill, RiMore2Fill, RiSearchLine } from "react-icons/ri";
import Block from "../components/Block";
import { GoKebabHorizontal } from "react-icons/go";
import Masonry from "react-masonry-css";

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
  useEffect(() => {
    getUser(userId).then((v) => setUser(v as UserProps));
    getOrganization(params.id, userId).then((v) => setOrganizationData(v));
  }, []);
  useEffect(() => {
    if (!params.pageid) getPageList(userId);
  }, [location]);
  const height = 120;
  const getPageList = async (userId) => {
    const pageList = await getPages(params.id, userId);
    setPages(pageList);
    return pageList;
  };
  return (
    <>
      {params.pageid ? (
        <Outlet />
      ) : (
        <Container px="3">
          <Box pb={"3"}>
            <Flex gap="3" justify="between" direction={"column"}>
              <Heading size="8" weight={"medium"}>
                {organizationData.name}
              </Heading>
              {/**
               * TODO: Show input field when Search button is clicked.
               * - Creat a state (bool).
               * - Onclick toggle.
               * - Show on true.
               * - Font should be as big as the Heading.
               *  */}
              <Flex
                justify={"between"}
                style={{
                  background: "#e7e7e7",
                  width: "100%",
                  height: "48px",
                  borderRadius: "8px",
                  padding: "8px 20px",
                }}
              >
                <input
                  style={{
                    color: "#000",
                    background: "transparent",
                    border: "0px",
                    fontSize: "20px",
                  }}
                ></input>
                <Flex align={"center"}>
                  <RiSearchLine size={"21"} />
                </Flex>
              </Flex>
            </Flex>
          </Box>
          <Box
            className="collection"
            style={{ display: "flex", flexWrap: "wrap", marginBottom: "100px" }}
          >
            <Box p={"2"} width={"100%"}>
              <Flex justify={"between"} align={"center"}>
                <Text weight={"medium"}>Overview</Text>
                <Flex>
                  <Button variant="ghost" size="3" mx={"1"}></Button>
                </Flex>
              </Flex>
            </Box>
            <Masonry
              breakpointCols={{
                default: 6,
                1100: 4,
                700: 2,
              }}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {Object.keys(pages).map((v) => (
                <Box
                  onClick={() =>
                    navigate(
                      `/dashboard/org/${params.id}/page/${pages[v].slug}`
                    )
                  }
                  style={{
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    width: "100%",
                  }}
                >
                  <Box
                    px={"3"}
                    p={"1"}
                    style={{
                      margin: "4px",
                      background: "rgb(0, 210, 106)",
                      height: "auto",
                      borderRadius: "4px",
                      color: "rgb(255, 255, 255)",
                      padding: "11px",
                    }}
                  >
                    <Box>
                      <Text
                        size="1"
                        style={{
                          fontSize: "20px",
                          lineHeight: "24px",
                          fontWeight: "400",
                        }}
                      >
                        {pages[v].name}
                      </Text>
                      <Box width={"auto"} p={"0"} className="block-body">
                        <Text
                          size="1"
                          style={{
                            fontWeight: "200",
                          }}
                        >
                          {pages[v]?.body[0]}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Masonry>
            {/* For demo purposes */}
            <Box
              onClick={() => navigate(`/dashboard`)}
              style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                display: "inline-block",
                width: "100%",
              }}
            >
              <Box
                px={"3"}
                p={"1"}
                style={{
                  margin: "4px",
                  background: "#00d26a",
                  height,
                  borderRadius: "4px",
                  color: "#fff",
                }}
              >
                <Box>
                  <Text size="1">Daily Tasks</Text>
                  <Box width={"auto"} p={"0"}>
                    <div>
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            margin: "10px 0px",
                          }}
                        >
                          <div
                            style={{
                              display: "inline-block",
                              height: "15px",
                              width: "15px",
                              boxShadow: "0 0 0 2px #e5e5e5",
                              borderRadius: "100px",
                              marginRight: "9px",
                            }}
                          ></div>
                          <Text size={"1"}>Get more leads</Text>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "inline-block",
                              height: "15px",
                              width: "15px",
                              boxShadow: "0 0 0 2px #e5e5e5",
                              borderRadius: "100px",
                              marginRight: "9px",
                            }}
                          ></div>
                          <Text size={"1"}>
                            This is a task that needs to be completed
                          </Text>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            margin: "10px 0px",
                          }}
                        >
                          <div
                            style={{
                              display: "inline-block",
                              height: "15px",
                              width: "15px",
                              boxShadow: "0 0 0 2px #e5e5e5",
                              borderRadius: "100px",
                              marginRight: "9px",
                            }}
                          ></div>
                          <Text size={"1"}>Dont do any of these tasks</Text>
                        </div>
                      </div>
                    </div>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              onClick={() => navigate(`/dashboard`)}
              style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                display: "inline-block",
                width: "40%",
              }}
            >
              <Box
                px={"3"}
                p={"1"}
                style={{
                  margin: "4px",
                  background: "#000",
                  height,
                  borderRadius: "4px",
                  color: "#fff",
                }}
              >
                <Box>
                  <Text size="1">Shopping List</Text>
                  <Box width={"auto"} p={"0"}>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          margin: "10px 0px",
                        }}
                      >
                        <div
                          style={{
                            display: "inline-block",
                            height: "15px",
                            width: "15px",
                            boxShadow: "0 0 0 2px #e5e5e5",
                            borderRadius: "100px",
                            marginRight: "9px",
                          }}
                        ></div>
                        <Text size={"1"}>Food</Text>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "inline-block",
                            height: "15px",
                            width: "15px",
                            boxShadow: "0 0 0 2px #e5e5e5",
                            borderRadius: "100px",
                            marginRight: "9px",
                          }}
                        ></div>
                        <Text size={"1"}>Packaging</Text>
                      </div>
                    </div>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              onClick={() => navigate(`/dashboard`)}
              style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                display: "inline-block",
                width: "60%",
              }}
            >
              <Box
                px={"3"}
                p={"1"}
                style={{
                  margin: "4px",
                  background: "#454ade",
                  height,
                  borderRadius: "4px",
                  color: "#fff",
                }}
              >
                <Box>
                  <Text size="1">New ideas!</Text>
                  <Box width={"auto"} p={"0"}>
                    <Text size="1">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              onClick={() => navigate(`/dashboard`)}
              style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                display: "inline-block",
                width: "100%",
              }}
            >
              <Box
                px={"3"}
                p={"1"}
                style={{
                  margin: "4px",
                  background: "#000",
                  height,
                  borderRadius: "4px",
                  color: "#fff",
                }}
              >
                <Box>
                  <Text size="1">New Leads</Text>
                  <Box width={"auto"} p={"0"}>
                    <Text size="1">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>
            {/* <Block h="120px" w="70%" bg="#DB3A34" head="Page 1 (Pages)" body="Page body (Content)" />
            <Block h="120px" w="29.5%" bg="#333333" head="Page 1 (Pages)" body="Page body (Content)" />
            <Block h="120px" w="50%" bg="#E3F2FD" head="Page 1 (Pages)" body="Page body (Content)" />
            <Block h="120px" w="49.5%" bg="#FFCA3A" head="Page 1 (Pages)" body="Page body (Content)" />
            <Block h="200px" w="99.9%" bg="#00CC66" head="Page 1 (Pages)" body="Page body (Content)" /> */}
          </Box>
          {/* <Block h="100px" w="99.9%" bg="#E3F2FD" head="Page 1 (Pages)" body="Page body (Content)" />
        <Block h="100px" w="99.9%" bg="#E3F2FD" head="Page 1 (Pages)" body="Page body (Content)" /> */}
        </Container>
      )}
    </>
  );
}
