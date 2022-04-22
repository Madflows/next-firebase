import styles from "../../styles/Admin.module.css";
import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";
import { UserContext } from "../../lib/context";
import { firestore, auth, serverTimestamp } from "../../lib/firebase";

import { useContext, useState } from "react";
import { useRouter } from "next/router";

import { useCollection } from "react-firebase-hooks/firestore";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";

const AdminPostsPage = ({}) => {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
};

function PostList() {
  const ref = firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("posts");
  const query = ref.orderBy("createdAt");
  const [querySnapshot] = useCollection(query);

  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const getPlaceHolder = () => {
    const placeholders = [
      "My Awesome Article",
      "Why CSS is never gonna be obsolete",
      "I have an issue with my code",
      "Dev.to?",
      "Why JavaScript is Bad 😏",
    ];
    const num = Math.floor(Math.random() * placeholders.length);
    return placeholders[num];
  };
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  // Create a new post in Firestore
  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = firestore
      .collection("users")
      .doc(uid)
      .collection("posts")
      .doc(slug);

    // Tip: give all fields a default value here
    const data = {
      title: title,
      slug: slug,
      uid: '',
      username: username,
      published: false,
      content: "# Hi Guys",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };
    await ref.set(data);
    toast.success("Post Created!");

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={getPlaceHolder}
        className={styles.input}
      />
      <p className="font-sofia">
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}

export default AdminPostsPage;
