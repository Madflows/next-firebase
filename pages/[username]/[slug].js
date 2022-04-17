import styles from "../../styles/Post.module.css";
import PostContent from "../../components/PostContent";
import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import AuthCheck from "../../components/AuthCheck";
import HeartButton from "../../components/HeartButton";
import Link from "next/link";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = userDoc.ref.collection("posts").doc(slug);
    post = postToJSON(await postRef.get());

    path = postRef.path;
  }

  return {
    props: {
      post,
      path,
    },
    revalidate: 5000,
  };
}

export async function getStaticProps() {
  // improve my using Admin SDK to select empty documents
  const snapshot = await firestore.collectionGroup("posts").get();

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    // must be in this format:
    // paths: [{params: {username, slug}}],
    paths,
    fallback: "blocking",
  };
}

const Post = (props) => {
  const postRef = firestore.doc(props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>
            {post.heartCount || 0}{" "}
            <box-icon name="heart" color="#231e1e"></box-icon>
          </strong>
        </p>
        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>
                <box-icon name="heart" color="#231e1e"></box-icon> <br />
                Sign Up
              </button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>
      </aside>
    </main>
  );
};

export default Post;
