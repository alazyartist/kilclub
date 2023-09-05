import { SignIn, SignedOut, UserButton } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>keepitlocal.club</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-base-light">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-accent-light sm:text-[5rem]">
            Keep <span className="text-[hsl(280,100%,70%)]">it</span> Local
          </h1>
          <div className="space-y-2 flex-col -center">
            <div className="flex-row -center gap-4">
              <label className="text-primary-dark font-bold">Zip Code: </label>
              <input
                className="border-2 border-primary-dark"
                onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault(); } }}
              />
              <button className="font-bold text-xl text-white bg-primary-dark py-1 px-1 rounded-full">[?]</button>

            </div>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-accent-dark p-4 text-white hover:bg-white/20"
              href="/testing"
            >
              <h3 className="text-2xl font-bold text-[accent-light]">Button One</h3>
              <div className="text-lg">----------</div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-accent p-4 text-white hover:bg-white/20"
              href="/test"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Button Two</h3>
              <div className="text-lg">----------</div>
            </Link>
          </div>
          <UserButton />
          <SignedOut>
            <SignIn />
          </SignedOut>
        </div>
      </main>
    </>
  );
}
