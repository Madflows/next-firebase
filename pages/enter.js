import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import { useContext, useState, useEffect, useCallback } from "react";
import { UserContext } from "../lib/context";
import debounce from "lodash.debounce";
import Image from 'next/image';

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
      <Image
        className="btn-image"
        width="30px"
        height="30px"
        src={"/google.png"}
        alt="Google"
      />
      <span style={{ marginRight: "10" }}>Sign in with Google</span>
    </button>
  );
}

// Sign Out Button
function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const onChange = (e) => {
    // Force form value typed in the form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 or it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  // Hit the dtatabase for username match after debounced changes
  //  useCallBack is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length > 3) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        console.log("🔥 Firestore read executed!");
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`usernames/${formValue}`);

    // commit both docs together as a batch write.
    const batch = firestore.batch();
    batch.set(userDoc, { 
      username: formValue, 
      photoURL: user.photoURL,
      displayName: user.displayName, 
      verified: false,
    });
    batch.set(usernameDoc, {
      uid: user.uid,
    });

    await batch.commit();


  };

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Set Username
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading){
    return <p>Checking...</p>
  } else if (isValid) {
    return <p className="text-success">{username} is available</p>
  } else if (username && !isValid){
    return <p className="text-danger">{username} is taken!</p>
  } else {
    return <p>Enter a username</p>
  }
}