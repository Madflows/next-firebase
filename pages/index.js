import Head from "next/head";
import Link from "next/link";

import Loader from "../components/Loader";
import toast from "react-hot-toast";

export default function Home() {
  return (
    <main>
      <Head>
        <title>Dev.to Clone</title>
        <meta name="description" content="A Dev.to CLone by Folarin Lawal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <button
          onClick={() => {
            toast.success("Clicked");
          }}
        >
          Make Toast
        </button>
      </div>
    </main>
  );
}
