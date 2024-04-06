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
import { Masonry } from "react-masonry/dist";
import Block from "../components/Block";
import { GoKebabHorizontal } from "react-icons/go";
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
                  <input style={{
                    color: "#000",
                    background: "transparent",
                    border: "0px",
                    fontSize: "20px",
                  }}></input>
                <Flex align={"center"}>
                  <RiSearchLine size={"21"} />
                </Flex>
              </Flex>
            </Flex>
          </Box>
          
          <Box
            className="collection"
            mb={"5"}
            style={{ display: "flex", flexWrap: "wrap" }}
          >
            <Box p={"2"} width={"100%"}>
              <Flex justify={"between"} align={"center"}>
                <Text weight={"medium"}>Overview</Text>
                <Flex>
                  <Button variant="ghost" size="3" mx={"1"}></Button>
                </Flex>
              </Flex>
            </Box>
            {Object.keys(pages).map((v) => (
              <Block
                h="65px"
                w="50%"
                bg="#00D26A"
                head={pages[v].name}
                body={"/"+pages[v].slug}
                data={pages[v]}
                key={pages[v].id}
              />
            ))}
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
