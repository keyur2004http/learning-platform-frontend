import Image from "next/image";
import styles from "./page.module.css";
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { redirect } from "next/navigation";

export default function Home() {
   redirect("/courses");
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>     
      
    </ThemeProvider>  );
}
