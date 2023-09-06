import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Background from "~/components/Background";
import Header from "~/components/Header";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Header />
      <Background>
        <Component {...pageProps} />;
      </Background>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
