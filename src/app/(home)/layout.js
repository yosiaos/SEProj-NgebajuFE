'use client';

import { useState } from "react";

import "../globals.css";
import * as Font from "@/components/fonts.js"
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CartPopUp from "@/components/cart";

// export const metadata = {
//   title: "NgeBaju-APP",
//   description: "Group 8th - Software Engineering Project",
// };

export default function RootLayout({ children }) {

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>
          NgeBaju
        </title>
        <link rel="icon" href="/favicon.png"/>
      </head>
      <body
        className={`${Font.poppins.className} antialiased flex flex-col bg-background text-foreground`}
      >
        <Navbar tooglePopUp={() => setIsPopupVisible(true)}/>
        <CartPopUp  isVisible={isPopupVisible} onClose={() => setIsPopupVisible(false)}>
          <h1>PELER</h1>
        </CartPopUp>
        {children}
        <Footer />
      </body>
    </html>
  );
}
