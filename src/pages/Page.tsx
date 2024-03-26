import {
  AlertDialog,
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  DropdownMenu,
  Flex,
  Heading,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { RiAddCircleFill, RiDeleteBin7Line, RiEditFill } from "react-icons/ri";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { changePageStatus, getPage, saveElement, savePage } from "../db";
import {
  ElementProps,
  ElementType,
  PageBodyProps,
  PageStatus,
  TodoProps,
  TodoStatus,
} from "../interfaces/interfaces";
import styles from "../assets/page.module.css";
import axios from "axios";

export function Component() {
  const params = useParams();
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState({} as PageBodyProps | string[]);
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const itemsRef = useRef([]);

  useEffect(() => {
    if (params.pageid != "new-page") {
      setEditMode(editMode);
      /**
       * IIFE
       * An IIFE (Immediately Invoked Function Expression) is a JavaScript
       * function that runs as soon as it is defined.
       */
      (async () => {
        const page = await getPage(params.pageid, userId);
        setName(page.name);
        setBody(page.body);
        setId(page.id);
        setLoading(false);
      })();
    } else {
      setLoading(false);
    }
  }, [params.id]);
  useEffect(() => {
    itemsRef.current.forEach((e) => {
      e.style.height = `${e.scrollHeight}px`;
    });
  }, [body, editMode]);
  const handleSavePage = () => {
    console.log("saving page");
    setEditMode(!editMode);
    
    const page = savePage(
      {
        name: name,
        body: body,
        id: id,
        slug: params.pageid ? params.pageid : "",
      },
      userId,
      params.id
    ).then((slug) => navigate(`/dashboard/org/${params.id}/page/${slug}`));
    //Take all element data and save
    //Automatically save
  };

  const addElement = async (type: ElementType, body?: string) => {
    /**
     * Call to firebase: add an element
     * Type is body
     * sends back the id
     * id gets saved to the body state
     * the page saves automatically to write the addition of a new element to database
     */
    let elem: ElementProps = {
      body: body || "",
      order: 0,
      status: "active",
      type: type,
      userId: userId,
      orgId: "",
      pageId: "",
    };
    switch (type) {
      case ElementType.TEXT:
        break;
      case ElementType.LINK:
        elem.body = [];
        break;
      case ElementType.TODO:
        elem.body = [
          {
            title: "",
            description: "",
            date: new Date(),
            status: TodoStatus.INCOMPLETE,
          },
        ];
        break;
      default:
        break;
    }

    let id = await saveElement(elem);
    setBody((prev) => ({
      ...prev,
      [id]: elem,
    }));
  };

  const addLink = (bodyIndex) => {
    console.log(body[bodyIndex]);
    setBody((prev) => {
      return {
        ...prev,
        [bodyIndex]: {
          ...prev[bodyIndex],
          body: [
            ...prev[bodyIndex].body,
            {
              title: "",
              url: "",
              img: "",
            },
          ],
        },
      };
    });
  };

  const addTodo = (bodyIndex) => {
    setBody((prev) => {
      return {
        ...prev,
        [bodyIndex]: {
          ...prev[bodyIndex],
          body: [
            ...prev[bodyIndex].body,
            {
              title: "",
              description: "",
              date: new Date(),
              status: TodoStatus.INCOMPLETE,
            },
          ],
        },
      };
    });
  };
  const updateLinkOrTodo = (dataObject, todoIndex, bodyIndex) => {
    setBody((prev) => {
      return {
        ...prev,
        [bodyIndex]: {
          ...prev[bodyIndex],
          body: prev[bodyIndex].body.map((v, k) =>
            todoIndex == k
              ? {
                  ...v,
                  ...dataObject,
                }
              : v
          ),
        },
      };
    });
  };
  const handleElementChange = (elem, value, type, id) => {
    elem.style.height = `${elem.scrollHeight}px`;
    setBody({
      ...body,
      [id]: {
        ...body[id],
        body: value,
      },
    });
  };

  const handleDeletePage = async () => {
    changePageStatus(params.pageid, userId, PageStatus.DELETED);
    navigate(`/dashboard/org/${params.id}/`);
  };

  const getShoppingItems = async () => {
    setLoading(true);
    const userToken = import.meta.env.VITE_ECWID_PUBLIC_TOKEN;
    const storeId = 26494476;
    var requestURL = "https://app.ecwid.com/api/v3/" + storeId + "/products";
    try {
      const maxProducts = 1000; // Total number of products you want to retrieve
      const productsPerPage = 100; // Products per page (API limit)
      const totalPages = Math.ceil(maxProducts / productsPerPage);

      const allProducts = [];

      for (let page = 1; page <= totalPages; page++) {
        const offset = (page - 1) * productsPerPage;
        const response = await axios.get(requestURL, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            Accept: "application/json",
          },
          params: {
            responseFields: "count,items(name,quantity)",
            enabled: "true",
            offset,
          },
        });

        allProducts.push(...response.data.items);
      }
      const sortedProducts = allProducts
        .filter((a) => a.quantity < 10)
        .sort((a, b) => a.quantity - b.quantity)
        .map((a) => "🔴 " + a.name + ": " + a.quantity);
      addElement(ElementType.TEXT, sortedProducts.join("\n\n"));
      setLoading(false);
      // Save allProducts to a state variable or handle it as needed
    } catch (error) {
      console.error("Error fetching data from Ecwid API:", error);
    }
  };

  return (
    <>
      <Container px="3" pb={"5"}>
        <Box pb={"3"}>
          <Flex gap={"3"}>
            <Button onClick={() => navigate(`/dashboard/org/${params.id}`)}>
              Cancel
            </Button>
            {editMode ? (
              <Button onClick={handleSavePage}>
                <RiAddCircleFill width="16" height="16" /> Save
              </Button>
            ) : (
              <Button onClick={() => setEditMode(!editMode)}>
                <RiEditFill width="16" height="16" /> Edit
              </Button>
            )}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="soft">Options</Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item onClick={getShoppingItems}>
                  Get low stock items from store
                </DropdownMenu.Item>
                <DropdownMenu.Item>Get full menu from store</DropdownMenu.Item>
                <DropdownMenu.Item onClick={handleDeletePage} color="red">
                  Delete Page
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
        </Box>

        {loading ? (
          <>
            <Box style={{ height: "50px" }} className={styles.skeleton}></Box>
            <Box style={{ height: "100px" }} className={styles.skeleton}></Box>
          </>
        ) : (
          <>
            <Box pb={"3"}>
              <TextField.Input
                size="3"
                placeholder="New Page"
                autoFocus={editMode}
                value={name}
                variant="soft"
                readOnly={!editMode}
                className={styles.title}
                onChange={(v) => setName(v.target.value)}
              />
            </Box>
            {Object.keys(body).sort((a, b) => body[a].order - body[b].order).map((key, i) => (
              <Box key={key}>
                {body[key].type == ElementType.TEXT && (
                  <Box pb={"3"}>
                    <TextArea
                      variant="soft"
                      readOnly={!editMode}
                      size={"3"}
                      ref={(el) => (itemsRef.current[i] = el)}
                      className={styles.textarea}
                      onChange={(e) =>
                        handleElementChange(
                          e.currentTarget,
                          e.target.value,
                          body[key].type,
                          key
                        )
                      }
                      value={body[key].body}
                    />
                  </Box>
                )}
                {body[key].type == ElementType.LINK && (
                  <Box pb={"3"}>
                    <Card>
                      {body[key].body.map((link, index) => (
                        <Box>
                          <Avatar
                            fallback={
                              link.title != "" && link.title?.substring(0, 2)
                            }
                          ></Avatar>
                          <TextField.Input
                            size="2"
                            placeholder="New Page"
                            value={link.url}
                            variant="soft"
                            autoFocus
                            readOnly={!editMode}
                            onChange={(e) => {
                              updateLinkOrTodo(
                                { url: e.target.value },
                                index,
                                key
                              );
                              updateLinkOrTodo(
                                {
                                  title: e.target.value
                                    .replace("www.", "")
                                    .replace("http://", "")
                                    .replace("https://", ""),
                                },
                                index,
                                key
                              );
                            }}
                          />
                          <TextField.Input
                            size="2"
                            placeholder="New Page"
                            value={link.title}
                            variant="soft"
                            readOnly={!editMode}
                            onChange={(e) =>
                              updateLinkOrTodo(
                                { title: e.target.value },
                                index,
                                key
                              )
                            }
                          />
                        </Box>
                      ))}
                      <Button
                        onClick={() => {
                          addLink(key);
                        }}
                      >
                        Add anohter link
                      </Button>
                    </Card>
                  </Box>
                )}
                {body[key].type == ElementType.TODO && (
                  <Box pb={"3"}>
                    <Card>
                      {Array.isArray(body[key].body) &&
                        body[key].body.map((todo: TodoProps, index) => (
                          <Flex gap="3" align="center">
                            <Checkbox
                              defaultChecked={
                                todo.status == TodoStatus.COMPLETED
                                  ? true
                                  : false
                              }
                              value={
                                todo.status == TodoStatus.COMPLETED ? 1 : 0
                              }
                              onClick={(e) =>
                                updateLinkOrTodo(
                                  {
                                    status: Math.abs(+e.currentTarget.value - 1)
                                      ? TodoStatus.COMPLETED
                                      : TodoStatus.INCOMPLETE,
                                  },
                                  index,
                                  key
                                )
                              }
                              size="3"
                            />
                            <Flex gap="3" align="center">
                              <Box>
                                <TextField.Input
                                  size="2"
                                  placeholder="New Page"
                                  value={todo.title}
                                  variant="soft"
                                  readOnly={!editMode}
                                  onChange={(e) =>
                                    updateLinkOrTodo(
                                      { title: e.target.value },
                                      index,
                                      key
                                    )
                                  }
                                />
                                <TextField.Input
                                  size="1"
                                  placeholder="New Page"
                                  value={todo.description}
                                  variant="soft"
                                  readOnly={!editMode}
                                  onChange={(e) =>
                                    updateLinkOrTodo(
                                      { description: e.target.value },
                                      index,
                                      key
                                    )
                                  }
                                />
                              </Box>
                            </Flex>
                          </Flex>
                        ))}
                      <Button onClick={() => addTodo(key)}>Add todo</Button>
                    </Card>
                  </Box>
                )}
              </Box>
            ))}
          </>
        )}

        {editMode && (
          <Box pb={"3"}>
            <AlertDialog.Root>
              <AlertDialog.Trigger>
                <Button
                  variant={Object.keys(body).length > 0 ? "soft" : "solid"}
                  style={{ width: "100%", fontWeight: "400" }}
                  size="3"
                >
                  <RiAddCircleFill width="16" height="16" /> Add a block
                </Button>
              </AlertDialog.Trigger>
              <AlertDialog.Content style={{ maxWidth: 450 }}>
                <AlertDialog.Title>Add a block</AlertDialog.Title>
                <Flex direction={"column"}>
                  <AlertDialog.Action
                    onClick={() => addElement(ElementType.TEXT)}
                  >
                    <Card my={"1"}>
                      <Text as="div" size="2" weight="bold">
                        {" "}
                        Body{" "}
                      </Text>
                      <Text as="div" color="gray" size="2">
                        A body element that holds text.
                      </Text>
                    </Card>
                  </AlertDialog.Action>
                  <AlertDialog.Action
                    onClick={() => addElement(ElementType.TODO)}
                  >
                    <Card my={"1"}>
                      <Text as="div" size="2" weight="bold">
                        {" "}
                        To Do{" "}
                      </Text>
                    </Card>
                  </AlertDialog.Action>
                  <AlertDialog.Action
                    onClick={() => addElement(ElementType.LINK)}
                  >
                    <Card my={"1"}>
                      <Text as="div" size="2" weight="bold">
                        {" "}
                        Links{" "}
                      </Text>
                    </Card>
                  </AlertDialog.Action>
                </Flex>
              </AlertDialog.Content>
            </AlertDialog.Root>
          </Box>
        )}
      </Container>
    </>
  );
}
