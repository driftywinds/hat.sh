/* eslint-disable @next/next/no-sync-scripts */
import Head from "next/head";
import { StrictMode } from "react";
import { getTranslations as t } from "../locales";
import "../public/assets/styles/style.css";
import { checkTheme } from "../src/config/Theme";

//check wether the user prefers/chose dark theme
checkTheme();

function MyApp({ Component, pageProps }) {
  return (
    <StrictMode>
      <Head>
        <title>
          {"Hat.sh"}
          {" - "}
          {t("sub_title")}
        </title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />

        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Encrypt and Decrypt files securely in your browser."
        />
        <meta
          name="Keywords"
          content="encrypt decrypt encryption file-encryption javascript client-side serverless decryption xchcha20 argon2id encryption-decryption webcrypto crypto browser in-browser"
        />
        <meta
          name="theme-color"
          content="#fafafa"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#1c1c1c"
          media="(prefers-color-scheme: dark)"
        />
        
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* React 19 optimizations */}
        <meta name="react-version" content="19" />
      </Head>

      <Component {...pageProps} />
    </StrictMode>
  );
}

export default MyApp;
