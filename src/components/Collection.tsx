import { Box, Container, Flex, Avatar, Text, Heading, Button, DropdownMenu } from "@radix-ui/themes";
import logo from '../assets/logo.png';
import { getUsers } from "../db";
import { useState, useEffect } from "react";
interface User {
    id: string;
    name: string;
  }
const Collection = () => {

    const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await getUsers();
      setUsers(usersData);
    };
    fetchUsers();
  }, []);



    return(
        <>
         
         <Flex gap="3" align="center">
  <Heading size="3">Collection One</Heading>

  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <Button variant="soft" size="2">
        Options
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content size="2">
      <DropdownMenu.Item>Edit</DropdownMenu.Item>
      <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
      <DropdownMenu.Separator />
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
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
        </>
    )
}
export default Collection;