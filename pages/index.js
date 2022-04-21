import PostFeed from '../components/PostFeed';
import Loader from "../components/Loader";
import { useState } from 'react';

import { firestore, fromMillis, postToJSON } from '../lib/firebase'

// Max post to query per page
const MAX_POSTS_PER_PAGE = 10;

export async function getServerSideProps(context) {
  const postsQuery = firestore
    .collectionGroup('posts')
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(MAX_POSTS_PER_PAGE);

  const posts = (await postsQuery.get()).docs.map(postToJSON)


  return {
    props: { posts },
  }
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  const loadMore = async () => {
    setLoading(true);

    const last = posts[posts.length - 1];
    const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;

    const postsQuery = firestore
      .collectionGroup('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(MAX_POSTS_PER_PAGE)
      .startAfter(cursor);

    const newPosts = (await postsQuery.get()).docs.map(postToJSON);
    setPosts([...posts, ...newPosts]);
    setLoading(false);

    if (newPosts.length < MAX_POSTS_PER_PAGE) {
      setPostsEnd(true);
    }
  }


  return (
    <main>
      <InfoPost />
      <PostFeed posts={posts} />
      {!postsEnd && !loading && (
        <button onClick={loadMore}>Load more</button>
      )}
      {loading && <Loader />}
      {postsEnd && <p>No more posts to load</p>}
    </main>
  );
}

function InfoPost() {
  return(
    <div className="card bg-blue info-card">
      <h1 className="title">Welcome to DevChat</h1>
      <p>Made with NextJS and Firebase</p>
    </div>
  )
}
