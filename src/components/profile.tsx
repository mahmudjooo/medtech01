import { api } from "@/service/api";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Profile = () => {
  const [user, setUser] = useState({});
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>{user.email}</DropdownMenuItem>
        <DropdownMenuItem>{user.role}</DropdownMenuItem>
        <DropdownMenuItem></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
