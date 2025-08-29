import {Layout, Link, Navbar} from "nextra-theme-docs";
import {getPageMap} from "nextra/page-map";
import "nextra-theme-docs/style.css";
import React from "react";
import "./globals.css";
import {Banner} from "nextra/components";
import {Footer} from "../components/blocks/Footer";
import {Head} from "nextra/components";
import {Analytics} from "@vercel/analytics/next";

export const metadata = {
  title: "shadcn-native",
  description: "shadcn-native",
};

const navbar = (
  <Navbar
    logo={<b>shadcn-native</b>}
    projectLink="https://github.com/moveinready-casa/shadcn-native"
  />
);
const footer = <Footer />;
const banner = (
  <Banner>
    <p>
      Built by <Link href="https://moveinready.casa">moveinready.casa</Link> and
      the community
    </p>
  </Banner>
);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/moveinready-casa/shadcn-native"
          footer={footer}
          banner={banner}
        >
          {children}
        </Layout>
        <Analytics />
      </body>
    </html>
  );
}
