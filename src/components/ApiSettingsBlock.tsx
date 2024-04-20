import { Button, Card, TextField, Text, Box } from "@radix-ui/themes";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  addEmailToShareList,
  getOrganizaionUsers,
  getOrganization,
  getPages,
  getUser,
  saveAPIConnection,
} from "../db";
import ReactJson from "@microlink/react-json-view";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios, { AxiosResponse } from "axios";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import { IoPlayOutline } from "react-icons/io5";
import { FiPlay } from "react-icons/fi";
import { BsSave } from "react-icons/bs";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
export function ApiSettingsBlock() {
  const navigate = useNavigate();
  const params = useParams();
  let location = useLocation();
  const { userId } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [endpoint, setEndpoint] = useState(
    "https://app.ecwid.com/api/v3/26494476/products"
  );
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<AxiosResponse<any, any>>();
  const [take, setTake] = useState("");
  const [parsedResponse, setParsedResponse] = useState({});
  const [code, setCode] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleChange = (editor, data, value) => {
    setCode(value);
    setBody(value);
  };

  const test = async () => {
    /**
     * https://app.ecwid.com/api/v3/26494476/products
     * {"headers":{"Authorization":"Bearer public_fYqp6KGkgvuzexRw82Ez7kLhAE3UBYSb","Accept":"application/json"},"params":{"responseFields":"count,items(name,quantity)","enabled":"true","offset":1}}
     */
    const response = await axios.get(endpoint, JSON.parse(body));
    console.log(endpoint, body, response);
    setResponse(response);
  };
  useEffect(() => {
    if (take && take.length > 0 && response) {
      const keys = take.split(".");
      const value = keys.reduce(
        (acc, key) => (acc && acc[key] !== "undefined" ? acc[key] : undefined),
        response
      );
      setParsedResponse(value);

      console.log(
        value &&
          Object.keys(value).length > 0 &&
          value.length > 0 &&
          value
            .map((item) => `${item.name} value:${item.quantity} value`)
            .join("\n")
      ); //as string
    }
  }, [take]);

  const handleSave = async () => {
    await saveAPIConnection(userId, params.id, name, endpoint, body, take)
  }

  const handleDelete = async () => {
    await deleteAPIConnection(userId, params.id, id)
  }

  return (
    <>
      <Card onClick={expanded ? () => null : () => setExpanded(true)}>
        <Box style={{ display: "flex", gap: "$2" }}>
          <Box style={{ flex: "1" }}>
            <TextField.Input
              placeholder="Enter API Name"
              value={name}
              className={expanded ? "ghostInput" : "ghostInputInvisible"}
              mb={expanded ? "3" : "0"}
              style={{ fontSize: "20px" }}
              onChange={(v) => setName(v.target.value)}
            ></TextField.Input>
          </Box>
          {!false && (
            <Box style={{ width: "20%" }}>
              <Button
                variant="soft"
                onClick={() => setExpanded(!expanded)}
                style={{
                  justifySelf: "flex-end",
                  width: "100%",
                  background: "transparent",
                }}
              >
                {expanded ? (
                  <MdExpandLess size={24} />
                ) : (
                  <MdExpandMore size={24} />
                )}
              </Button>
            </Box>
          )}
        </Box>
        {expanded && (
          <>
            <Text size={"1"}>Endpoint</Text>
            <TextField.Input
              mb="3"
              placeholder="Enter API Endpoint"
              value={endpoint}
              onChange={(v) => setEndpoint(v.target.value)}
            ></TextField.Input>
            <Text size={"1"}>JSON Body</Text>
            <CodeMirror
              value={body}
              onBeforeChange={handleChange}
              options={{
                mode: "javascript",
                theme: "material",
                lineNumbers: true,
                lineWrapping: true,
              }}
            />
            <Box mb={"3"}>
              <Button onClick={test} style={{ width: "100%" }}>
                {" "}
                <FiPlay /> Test
              </Button>
            </Box>
            <Text size={"1"}>Response</Text>
            <ReactJson
              src={response}
              collapsed={true}
              style={{ marginBlock: ".4em" }}
            />
            <Text size={"1"}>What values to take from the response</Text>
            <TextField.Input
              mb="3"
              placeholder="Enter Takes"
              value={take}
              onChange={(v) => setTake(v.target.value)}
            ></TextField.Input>
            <Text size={"1"}>Traken values</Text>
            <ReactJson
              src={parsedResponse}
              collapsed={true}
              style={{ marginBlock: ".4em" }}
            />
            <Button
              onClick={handleSave}
              style={{ width: "100%" }}
              my={"3"}
              size={"3"}
            >
              {" "}
              Save
            </Button>
            <Button
              onClick={handleDelete}
              style={{ width: "100%" }}
              size={"3"}
              color="red"
            >
              {" "}
              Delete
            </Button>
          </>
        )}
      </Card>
    </>
  );
}
