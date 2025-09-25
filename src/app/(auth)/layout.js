import "@/app/globals.css"
import * as Font from "@/components/fonts.js"
import Image from "next/image";

export const metadata = {
  title: "NgeBaju - Login",
  description: "Group 8th - Software Engineering Project",
};

export default function AuthLayout({ children, title }) {
  return (
    <html lang="en">
      <head>
        <title>
          {title}
        </title>

        <link rel="icon" href="/favicon.png"/>
      </head>
      <body
        className={`${Font.poppins.className} antialiased bg-background text-foreground justify-between`}
      >
        <div className=" flex flex-row text-white justify-between items-start gap-10 p-20">
          {children}
          <div className="w-[50%] h-[110vh] bg-center bg-contain bg-no-repeat" style={{backgroundImage : "url('/auth/auth-img.png')"}}>

          </div>
        </div>
      </body>
    </html>
  );
}
