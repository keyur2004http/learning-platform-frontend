import "./globals.css";
import Navbar from "./components/Navbar";
import { Providers } from "./providers";

export const metadata = {
  title: "Learns Hub",
  description: "Learn. Build. Grow.",
};
export default function RootLayout({ children }) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
        <Providers>
          <header>
            <Navbar />
          </header>
          {children}
        </Providers>
      </body>
    </html>
  );
}
