import Head from "next/head";
import Link from "next/link";
import SearchBar from "~/components/search/SearchBar";

export default function Home() {
  return (
    <>
      <Head>
        <title>keepitlocal.club</title>
        <meta name="description" content="connecting communities" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className=" flex-coll container  min-h-[80vh] lg:flex-row">
          <div id="padding_only" className="p-8 lg:p-[3vw] xl:p-[5vw]" />
          <div className="flex-coll relative h-full space-y-4 p-4 lg:p-32 ">
            <div className="p-2 text-left text-4xl font-bold lg:text-7xl">
              Locally <span className="text-accent">owned</span>
              <br />
              Community <span className="text-accent">tested</span>
            </div>
            <SearchBar />
            {/* <Link
              className="flex-coll w-full max-w-xs rounded-xl bg-accent p-4 text-white hover:bg-accent-dark"
              href="/testing"
            >
              <h3 className="text-2xl font-bold text-[accent-light]">
                Button One
              </h3>
              <div className="text-lg">----------</div>
            </Link>
            <Link
              className="flex-coll w-full max-w-xs rounded-xl bg-accent p-4 text-white hover:bg-accent-dark"
              href="/"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Button Two</h3>
              <div className="text-lg">----------</div>
            </Link> */}
            <div className="p-20 lg:hidden" />
            <p className="text-center text-xs">have a business. see pricing</p>
            <div className="h-[900px] w-full rounded-3xl bg-accent p-2 lg:absolute lg:right-[-60%] lg:top-[90%] lg:w-[540px]">
              <p className="p-4 text-3xl text-zinc-100 lg:text-8xl">
                Insert FEATURED here
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
