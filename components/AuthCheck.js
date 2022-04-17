import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

// Component's children only shown to logged in users
const AuthCheck = (props) => {
  const { username } = useContext(UserContext);
  return username
    ? props.children
    : props.fallback || (
        <Link href="/enter">
          <div>
            <p className="font-sofia custom-link">You must be signed in to access this page!</p>
          </div>
        </Link>
      );
};

export default AuthCheck;
