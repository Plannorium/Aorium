import "./globals.css";
import Header from "./components/Header";
import CustomCursor from "./components/ui/CustomCursor";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="hide-cursor">
        <CustomCursor />
        <div className="flex flex-col min-h-screen bg-primary-dark text-neutral-light font-inter">
          <Header />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
