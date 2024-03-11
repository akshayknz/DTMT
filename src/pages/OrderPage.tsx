import {
  AlertDialog,
  Box,
  Button,
  Card,
  Container,
  DropdownMenu,
  Flex,
  Heading,
  Table,
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
} from "../interfaces/interfaces";
import styles from "../assets/page.module.css";
import axios from "axios";

export function Component() {
  const params = useParams();
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [csvData, setCsvData] = useState("") as any;
  const [csvDataArray, setCsvDataArray] = useState([]) as any;
  const [body, setBody] = useState({} as PageBodyProps | string[]);
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const itemsRef = useRef([]);

  useEffect(() => {
    if (params.pageid != "new-page") {
      setEditMode(editMode);
    } else {
      setLoading(false);
    }
  }, [params.id]);

  // Calculate the Levenshtein distance between two strings
  function levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;

    // Create a 2D array to store distances
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    // Initialize the first row and column
    for (let i = 0; i <= m; i++) {
      dp[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
      dp[0][j] = j;
    }

    // Fill in the rest of the array
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1, // Deletion
            dp[i][j - 1] + 1, // Insertion
            dp[i - 1][j - 1] + 1 // Substitution
          );
        }
      }
    }

    // Calculate similarity percentage
    const maxLen = Math.max(m, n);
    const distance = dp[m][n];
    const similarity = 1 - distance / maxLen;

    return similarity;
  }

  // const reduceSimilarity = (value: string) => value.replace("Hangry Vegan", "").replace("Soup", "");
  const reduceSimilarity = (value: string) => value;

  const saveToCsvDataArray = () => {
    const csv = csvData.trim().replace("ï»¿", "").split("\n"); //csvData has BOM ï»¿
    let arrayOfObjects = [...csvDataArray];
    for (let index = 0; index < csv.length; index++) {
      const element = csv[index];
      let row = element.trim().split(",");
      let item = row[0].replaceAll('"', "");
      let count = row[1].replaceAll('"', "");
      if (arrayOfObjects.length > 0) {
        // console.log(`iteration${index}`, item);
        let notFound = false;
        const temp = arrayOfObjects.filter((v, k) => {
          let lDistance = levenshteinDistance(
            reduceSimilarity(item),
            reduceSimilarity(arrayOfObjects[k].item)
          );
          // console.log(`temp' loop i=${i} row=${v.item} item=${item} arrayOfObjects[k].item=${arrayOfObjects[k].item} lDistance=${lDistance}`);
          let treshold = 0.7;
          if (lDistance >= treshold) {
            arrayOfObjects[k].count =
            parseInt(arrayOfObjects[k].count) + parseInt(count);
            csv.splice(index,1)
            item = ""
            return true;
          } else {
            return false;
          }
        });
        // console.log(`temp=${temp}`, temp);
        if (temp.length === 0) {
          // console.log(`Adding a new row=${item},${count}`);
          arrayOfObjects.push({ item: item, count: count });
        }
      } else {
        arrayOfObjects.push({ item: item, count: count });
      }
    }
    setCsvDataArray([...arrayOfObjects]);
  };

  const saveOrderCountToDb = () => {

  }
  return (
    <>
      <Container px="3" pb={"5"}>
        <Box pb={"3"}>
          <Flex gap={"3"}>
            <Button onClick={() => navigate(`/dashboard/org/${params.id}`)}>
              Cancel
            </Button>
          </Flex>
        </Box>
        <input
          accept=".csv"
          hidden
          placeholder="hello"
          style={{ display: "block" }}
          id="csvInput"
          onChange={() => {
            const reader = new FileReader();
            reader.onload = () => {
              setCsvData(reader.result);
            };
            // start reading the file. When it is done, calls the onload event defined above.
            reader.readAsBinaryString(
              // @ts-ignore
              document.getElementById("csvInput").files[0]
            );
          }}
          type="file"
        />
        <br/>
        <TextArea mb={"3"}placeholder="Reply to comment…" value={csvData} onChange={()=>null} style={{height:"50px"}}/>
        <Flex gap="3">
          <Button onClick={saveToCsvDataArray}>submit</Button>
          <Button onClick={saveOrderCountToDb}>Save as a week</Button>
        </Flex>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Sl No</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Number of Orders</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {csvDataArray
              .sort((v, vv) => vv.count - v.count)
              .map((v, k) => (
                <Table.Row key={v.item} style={{background:k%2==0?"rgba(0,0,0,.1 )":"transparent"}}>
                  <Table.Cell>{k}</Table.Cell>
                  <Table.Cell>{v.item}</Table.Cell>
                  <Table.Cell>{v.count}</Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table.Root>
      </Container>
    </>
  );
}
