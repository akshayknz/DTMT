import {
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
          <Box pt={"2"} pb={"3"}>
            <Text>
              Hi {user.displayName && user.displayName.split(" ")[0] + ","}
            </Text>
            <Flex gap="3" align="center" justify="between">
              <Heading size="7" weight={"medium"}>
                {organizationData.name}
              </Heading>
              {/**
               * TODO: Show input field when Search button is clicked.
               * - Creat a state (bool).
               * - Onclick toggle.
               * - Show on true.
               * - Font should be as big as the Heading.
               *  */}
              <Flex gap="3" align="center" justify="between">
                
                <Button variant="solid" size="3" radius="small">
                  <RiSearchLine />
                </Button>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="soft"><GoKebabHorizontal/></Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <Link to="settings#people-settings">
                      <DropdownMenu.Item>
                        Share this organization
                      </DropdownMenu.Item>
                    </Link>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
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
                <Text weight={"medium"}>Overview (Collection)</Text>
                <Flex>
                  <Button variant="solid" size="3" mx={"1"}>
                    <RiMore2Fill />
                  </Button>
                </Flex>
              </Flex>
            </Box>
            {Object.keys(pages).map((v) => (
              <Block
                h="120px"
                w="29%"
                bg="#DB3A34"
                head={pages[v].name}
                body="Page body (Content)"
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
