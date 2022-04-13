import Navbar from "../components/Navbar";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import { UserContext } from "../lib/context";

import { useUserData } from "../lib/hooks";  // custom hook for managing user data

function MyApp({ Component, pageProps }) {

  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
}

export default MyApp;
