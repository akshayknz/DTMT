import { Box, Flex, Text } from "@radix-ui/themes";
import { Spinner } from "../assets/Spinner";
import { useNavigate, useParams } from "react-router-dom";

const Block = ({ h, w, bg, head, body, data }) => {
  const params = useParams();
  const navigate = useNavigate();
  const height = h;
  return (
    <></>
  );
};

export default Block;
