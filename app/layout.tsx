import {Footer, Layout, Navbar} from "nextra-theme-docs";
import {getPageMap} from "nextra/page-map";
import "nextra-theme-docs/style.css";

export const metadata = {
  title: "shadcn-native",
  description: "shadcn-native",
};

const navbar = <Navbar logo={<b>shadcn-native</b>} />;
const footer = (
  <Footer>MIT {new Date().getFullYear()} © moveinready.casa.</Footer>
);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/moveinready-casa/shadcn-native"
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
