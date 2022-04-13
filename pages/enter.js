import { auth, googleAuthProvider } from "../lib/firebase";
import { useContext } from "react";
import { UserContext } from "../lib/context";

export default function EnterPage(props) {
  const { user, username } = useContext(UserContext);

  // There are 3 States the user cn be in
  //  1. user signed out <SignInButton />
  //  2. user signed in but missing username <UsernameForm />
  //  3. user signed in and has username <SignOutButton />

  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

// Sign in with Google Button
function SignInButton() {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };
  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={"/google.png"} alt="" /> Sign in with Google
    </button>
  );
}

// Sign Out Button
function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

function UsernameForm() {}
