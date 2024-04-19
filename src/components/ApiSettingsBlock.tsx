import { Button, Card, TextField } from "@radix-ui/themes";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  addEmailToShareList,
  getOrganizaionUsers,
  getOrganization,
  getPages,
  getUser,
} from "../db";
import ReactJson from "@microlink/react-json-view";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios, { AxiosResponse } from "axios";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
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
    console.log(
      "settingParsedResonposnes",
      response?.[
        "data.items".split(".").reduce((obj, key) => obj?.[key], response)
      ]
    );

    setParsedResponse(response?.data?.[take]);
  }, [take]);

  return (
    <>
      <Card>
        <TextField.Input
          mb="3"
          placeholder="Enter API Name"
          value={name}
          onChange={(v) => setName(v.target.value)}
        ></TextField.Input>
        <TextField.Input
          mb="3"
          placeholder="Enter API Endpoint"
          value={endpoint}
          onChange={(v) => setEndpoint(v.target.value)}
        ></TextField.Input>
        <CodeMirror
          value={body}
          onBeforeChange={handleChange}
          options={{
            mode: "javascript",
            theme: "material",
            lineNumbers: true,
            lineWrapping:true
          }}
        />
        <Button onClick={test}>Test</Button>
        <ReactJson src={response} collapsed={true} />
        <TextField.Input
          mb="3"
          placeholder="Enter Take"
          value={take}
          onChange={(v) => setTake(v.target.value)}
        ></TextField.Input>
        <ReactJson src={parsedResponse} collapsed={true} />
      </Card>
    </>
  );
}
