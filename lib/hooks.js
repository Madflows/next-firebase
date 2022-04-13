import { auth, firestore } from '../lib/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

export function useUserData() {
    const [user] = useAuthState(auth);
    const [username, setUserName] = useState(null);

    useEffect(() => {
      // Turn off realtime subscription
      let unsubscribe;
      if (user) {
        const ref = firestore.collection("users").doc(user.uid);
        unsubscribe = ref.onSnapshot((doc) => {
          setUserName(doc.data()?.username);
        });
      } else {
        setUserName(null);
      }

      return unsubscribe;
    }, [user]);

    return { user, username };
}