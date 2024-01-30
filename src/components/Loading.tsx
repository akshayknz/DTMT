import { Box, Flex, Text } from "@radix-ui/themes"
import { Spinner } from "../assets/Spinner"

const Loading = () => {
    return (
        <Box className="loading">
            <Flex 
                gap={"3"} 
                direction={"column"} 
                align={"center"} 
                justify={"center"}
                style={{height:"80vh"}}
                >
                <Spinner />
                <Text size={"1"}> Checking credentials, wait a moment...</Text>
            </Flex>
        </Box>
    )
}

export default Loading