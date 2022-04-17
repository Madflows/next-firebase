import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import { getUserWithUsername, postToJSON } from "../../lib/firebase";

// export an async getServerSideProps
// https://nextjs.org/docs/api-reference/data-fetching/getServerSideProps
export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  // If no user, short circuit to 404
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  // JSON serializable data
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    const postQuery = userDoc.ref
      .collection("posts")
      .where("published", '==', true)
      .orderBy("createdAt", "desc")
      .limit(5);
    posts = (await postQuery.get()).docs.map(postToJSON);
  }

  return {
    props: { user, posts },
  };
}

const UserProfilePage = ({ user, posts }) => {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
};

export default UserProfilePage;
