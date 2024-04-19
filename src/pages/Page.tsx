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
import GoogleCalendarICS from "../components/GoogleCalenderICS";
import { useDispatch, useSelector } from "react-redux";
import {
  clearHistory,
  setEditMode,
  setHistory,
  setSelectFromHistory,
  setTimetravelIndex,
  setUnsaved,
} from "../context/appSlice";
import { AppDispatch, RootState } from "../context/store";
import Masonry from "react-masonry-css";
export function Component() {
  const params = useParams();
  const [name, setName] = useState("");
  const [initName, setInitName] = useState("");
  const [id, setId] = useState("");
  const [slug, setSlug] = useState("");
  // const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState({} as PageBodyProps | string[]);
  const [initBody, setInitBody] = useState({} as PageBodyProps | string[]);
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const itemsRef = useRef([]);
  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  const {
    editMode,
    unsaved,
    history,
    timetravelIndex,
    toggleToSave,
    selectFromHistory,
  } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => { //Set heights of all body elements to content height
    if (itemsRef.current.every((ref) => ref)) {
      itemsRef.current.forEach((ref) => {
        ref.style.height = `auto`;
        ref.style.height = `${ref.scrollHeight + 5}px`;
      });
    }
  if (titleRef.current) { //Set height of title textarea 
    titleRef.current.style.height = `auto`;
    titleRef.current.style.height = `${titleRef.current.scrollHeight + 5}px`;
  }
  }, [itemsRef.current.length, loading]);
  useEffect(()=>{
    if (titleRef.current) { //Set height of title textarea 
      titleRef.current.style.height = `auto`;
      titleRef.current.style.height = `${titleRef.current.scrollHeight + 5}px`;
    }
  }, [name])
  useEffect(() => { //Check slug and show new-page or view page
    if (params.pageid != "new-page") { //View Page
      dispatch(setEditMode(editMode));
      /**
       * IIFE
       * An IIFE (Immediately Invoked Function Expression) is a JavaScript
       * function that runs as soon as it is defined.
       */
      (async () => {
        const page = await getPage(params.pageid, userId);
        setName(page.name);
        setInitName(page.name);
        setBody(page.body);
        dispatch(setHistory(JSON.stringify([page.body])));
        setInitBody(page.body);
        setId(page.id);
        setSlug(page.slug);
        setLoading(false);
        dispatch(setTimetravelIndex(-1));
        console.log(dispatch(setTimetravelIndex(-1)), timetravelIndex);
        dispatch(clearHistory());
      })();
    } else { //New page
      dispatch(clearHistory());
      setLoading(false);
    }
  }, [params.pageid]); //Runs on pageid change in path
  useEffect(() => { //Chnage body on slider move
    if (
      timetravelIndex != history.length - 1 &&
      history[timetravelIndex] != JSON.stringify(body) &&
      history[timetravelIndex]
    ) {
      setBody(JSON.parse(history[timetravelIndex]));
    }
  }, [timetravelIndex]);
  useEffect(() => {  //Save to history
    if (
      (JSON.stringify(initBody) != JSON.stringify(body) || initName != name) &&
      !selectFromHistory
    ) {
      dispatch(setHistory(JSON.stringify(body)));
      if (timetravelIndex === history.length - 1 || timetravelIndex === -1) {
      }
      dispatch(setUnsaved(true)); //TODO: FIX SETUNSAVED
    }
  }, [body, name]); //Onchange of body and name
  useEffect(() => { //Save page
    // console.log(`Detailed Log:unsaved ${unsaved},editMode ${editMode},toggleToSave ${toggleToSave}, timetravelIndex ${timetravelIndex}`);
    if (unsaved) {
      if (editMode === false) {
        console.log("initBody and body are not equal and editmode is false");
        handleSavePage();
      }
    }
    /**
     * toggleToSave: This state triggers a page save
     * Bool
     * from appSlice
     * triggered from the Navigation bar on save button click
     */
  }, [toggleToSave]); 
  /**
   * Save and may or maynot redirect to the saved url
   * - If no slug: new page created, redirected
   * - If path has slug/pageid: Update page, not redirected
   */
  const handleSavePage = () => { 
    console.log("saving started");
    dispatch(setEditMode(false));
    let noslug = slug === "";
    savePage(
      {
        name: name,
        body: body,
        id: id,
        slug: params.pageid ? params.pageid : "",
      },
      userId,
      params.id
    ).then((slug) => {
      dispatch(setUnsaved(false));

      if (noslug) { //redirect if its a new page
        console.log("saved");
        navigate(`/dashboard/org/${params.id}/page/${slug}`);
      }
    });
    //TODO: Automatically save, Save history logs
  };

  const addElement = async (type: ElementType, body?: string) => {
    //Add a block
    /**
     * Call to firebase: add an element
     * Type is body
     * sends back the id
     * id gets saved to the body state
     * the page saves automatically to write the addition of a new element to database
     */
    //Add block of body by default
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
    //Add a block of links
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
    //Add a block of todos
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
    //Update array based block
    dispatch(setSelectFromHistory(false));
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
    //Update value based block
    dispatch(setSelectFromHistory(false));
    elem.style.height = `auto`;
    elem.style.height = `${elem.scrollHeight + 5}px`;
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
      <Container px="3" style={{ paddingBottom: "150px" }}>
        <Box pb={"3"}>
          <Flex gap={"3"}>
            <Button onClick={() => navigate(`/dashboard/org/${params.id}`)}>
              Cancel
            </Button>
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
              <textarea
                placeholder="New Page"
                autoFocus={editMode}
                value={name}
                ref={titleRef}
                readOnly={!editMode}
                className={styles.title}
                onChange={(v) => setName(v.target.value)}
              >{name}</textarea>
            </Box>
            {Object.keys(body)
              .sort((a, b) => body[a].order - body[b].order)
              .map((key, i) => (
                <Box key={key}>
                  {body[key].type == ElementType.TEXT && (
                    <Box pb={"3"}>
                      <textarea
                        readOnly={!editMode}
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
                    <Box pb={"3"} className={styles.linkWrapperInside}>
                      <Masonry
                        breakpointCols={{
                          default: 6,
                          1100: 4,
                          700: 3,
                        }}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                      >
                        {body[key].body.map((link, index) => (
                          <Box
                            className={styles.linkWrapper}
                            onClick={(e) => {
                              if (editMode) {
                                e.preventDefault();
                              } else {
                                if (!link.url.startsWith("http")) {
                                  window.open(
                                    `https://${link.url}`,
                                    "_blank",
                                    "noopener,noreferrer"
                                  );
                                } else {
                                  window.open(
                                    link.url,
                                    "_blank",
                                    "noopener,noreferrer"
                                  );
                                }
                              }

                              return null;
                            }}
                          >
                            <Avatar
                              fallback={
                                link.title != "" && link.title?.substring(0, 2)
                              }
                            ></Avatar>
                            <input
                              placeholder="New Page"
                              value={link.url}
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
                            <input
                              placeholder="New Page"
                              value={link.title}
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
                        {editMode && (
                          <Box
                            className={styles.linkWrapper}
                            onClick={() => {
                              addLink(key);
                            }}
                          >
                            <Avatar fallback={"+"}></Avatar>
                            <input
                              placeholder="New Page"
                              value={"Add a link"}
                              autoFocus
                              readOnly={true}
                            />
                          </Box>
                        )}
                      </Masonry>
                    </Box>
                  )}
                  {body[key].type == ElementType.TODO && (
                    <Box pb={"3"}>
                      <Card>
                        {Array.isArray(body[key].body) &&
                          body[key].body.map((todo: TodoProps, index) => (
                            <Flex gap="3" align="center" className={styles.todoWrapper}>
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
                                      status: Math.abs(
                                        +e.currentTarget.value - 1
                                      )
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
                                  <input
                                    placeholder="New Page"
                                    value={todo.title}
                                    readOnly={!editMode}
                                    onChange={(e) =>
                                      updateLinkOrTodo(
                                        { title: e.target.value },
                                        index,
                                        key
                                      )
                                    }
                                  />
                                  <input
                                    placeholder="New Page"
                                    value={todo.description}
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
                                <GoogleCalendarICS
                                  event={{
                                    summary: todo.title,
                                    description: todo.description,
                                    start: new Date("2023-04-06T13:00:00Z"),
                                    end: new Date("2023-04-06T15:00:00Z"),
                                    location: "Organization",
                                  }}
                                />
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
