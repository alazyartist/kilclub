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
        <div className="flex-coll -center container">
          <div className="flex-coll -center space-y-2 p-4">
            {/* AutoComplete */}
            <SearchBar />
            <Link
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
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
