import { Link } from "react-router-dom";
import CreateUserForm from "../users/create-users";

const Sidebar = () => {
  return (
    <div className="">
      <Link to={"/create-user"}>Create user</Link>
    </div>
  );
};

export default Sidebar;
