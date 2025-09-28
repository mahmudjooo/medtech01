import { api } from "@/service/api";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogoutButton } from "./logout";
import { User } from "lucide-react";
import ChangePassword from "../../page/change-password";
import { Link } from "react-router-dom";

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
      <DropdownMenuTrigger>
        <User />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>{user.email}</DropdownMenuItem>
        <DropdownMenuItem>{user.role}</DropdownMenuItem>
        <DropdownMenuItem>
          <Link to={"/change-password"}>ChangePassword</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
