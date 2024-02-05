import { Flex, Heading, Button, DropdownMenu } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { RiMore2Fill } from "react-icons/ri";
import { UserProps } from "../interfaces/interfaces";

const Collection = () => {

    // const [users, setUsers] = useState<UserProps[]>([]);

  useEffect(() => {
  }, []);



    return(
        <>
         
         <Flex gap="3" align="center">
  <Heading size="3">Collection One</Heading>

  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <Button variant="soft" size="2">
      <RiMore2Fill />
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content size="2">
      <DropdownMenu.Item>Edit</DropdownMenu.Item>
      <DropdownMenu.Item>Archive</DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.Item color="red">
        Delete
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</Flex>
iitems
<ul>
      </ul>
        </>
    )
}
export default Collection;