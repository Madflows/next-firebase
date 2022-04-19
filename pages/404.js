import Link from 'next/link'

const Custom404 = () => {
  return (
    <main>
      <h1>404 - That page does not exist!!</h1>
      <iframe
        src="https://giphy.com/embed/14uQ3cOFteDaU"
        width="480"
        height="362"
        frameBorder="0"
        allowFullScreen
      ></iframe>
      <Link href="/">
        <button className="btn-blue">Get Back In!</button>
      </Link>
      <p>Hover the Button for a cool Effect!</p>
    </main>
  );
}

export default Custom404