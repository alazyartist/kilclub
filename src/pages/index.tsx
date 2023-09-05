import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>keepitlocal.club</title>
        <meta name="description" content="connecting communities" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="container flex-coll -center">
          <div className="flex-coll -center space-y-2 p-4">
            <div className="flex-row -center gap-4">
              <label className="text-primary-dark font-bold">Zip Code: </label>
              <input
                className="border-primary-dark border-2"
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
              />
              <button className="bg-primary-dark rounded-full px-2 py-1 text-m font-bold text-white">
                Search
              </button>
            </div>
            <Link
              className="w-full bg-accent max-w-xs flex-coll rounded-xl p-4 text-white hover:bg-accent-dark"
              href="/testing"
            >
              <h3 className="text-2xl font-bold text-[accent-light]">
                Button One
              </h3>
              <div className="text-lg">----------</div>
            </Link>
            <Link
              className="w-full bg-accent max-w-xs flex-coll rounded-xl p-4 text-white hover:bg-accent-dark"
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
