import Head from 'next/head'

export default function MetaTags({title, description, image}){
    return (
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@madflows_" />
        <meta name="twitter:title" content={title}/>
        <meta name="twitter:description" content={description}/>
        <meta name="twitter:image" content={image}/>

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content="https://madflows.dev" />
        <meta property="og:site_name" content={title} />
        <meta property="og:type" content="website" />

      </Head>
    );
}