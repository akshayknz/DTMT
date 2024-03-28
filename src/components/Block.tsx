import { Box, Flex, Text } from "@radix-ui/themes";
import { Spinner } from "../assets/Spinner";
import { useNavigate, useParams } from "react-router-dom";

const Block = ({ h, w, bg, head, body, data }) => {
  const params = useParams();
  const navigate = useNavigate();
  const height = h;
  return (
    <Box
      onClick={() => navigate(`/dashboard/org/${params.id}/page/${data.slug}`)}
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        display: "inline-block",
        width: w,
      }}
    >
      <Box
        px={"3"}
        p={"1"}
        style={{
          margin: "4px",
          background: bg,
          height,
          borderRadius: "4px",
          color: "#fff",
        }}
      >
        <Box>
          <Text size="1">{head}</Text>
          <Box width={"auto"} p={"1"}>
            <Text m={"1"} size="1">
              {body}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Block;
