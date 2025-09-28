import "./globals.css";
import Header from "./components/Header";
import CustomCursor from "./components/ui/CustomCursor";
import QueryProvider from "./components/QueryProvider"; // Import the new component
import NextAuthProvider from "./components/NextAuthProvider";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="hide-cursor overflow-y-scroll scrollbar-webkit scrollbar-firefox">
        <CustomCursor />
        <NextAuthProvider>
          <QueryProvider>
            {" "}
            {/* Add the new component here */}
            <div className="flex flex-col min-h-screen bg-primary-dark text-neutral-light font-inter">
              <Header />
              <main className="flex-1">
                <Suspense fallback={<div>Loading...</div>}>
                  {children}
                </Suspense>
              </main>
            </div>
          </QueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}