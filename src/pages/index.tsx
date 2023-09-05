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

      <main className="bg-base-light flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="-center flex-col space-y-2">
            <div className="-center flex-row gap-4">
              <label className="text-primary-dark font-bold">Zip Code: </label>
              <input
                className="border-primary-dark border-2"
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
              />
              <button className="bg-primary-dark rounded-full px-1 py-1 text-xl font-bold text-white">
                [?]
              </button>
            </div>
            <Link
              className="bg-accent-dark flex max-w-xs flex-col gap-4 rounded-xl p-4 text-white hover:bg-white/20"
              href="/testing"
            >
              <h3 className="text-2xl font-bold text-[accent-light]">
                Button One
              </h3>
              <div className="text-lg">----------</div>
            </Link>
            <Link
              className="bg-accent flex max-w-xs flex-col gap-4 rounded-xl p-4 text-white hover:bg-white/20"
              href="/test"
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
