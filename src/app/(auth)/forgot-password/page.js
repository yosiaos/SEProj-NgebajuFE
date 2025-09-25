import * as Font from "@/components/fonts.js"
import "@/style/form.css";
import Link from "next/link"


export default function ForgotPasswordPage(){
    return(
    <div className="w-[50%] flex gap-10 flex-col h-full forgot-password-contents">
      <h1 className={`${Font.dmSerifDisplay.className} text-7xl`}>
        NgeBaju
      </h1>
      <div className="my-auto">
        <div className="header-wrapper">
            <h1>
                Forgot Your Password?
            </h1>
            <h2>
                No worries, we will send you reset instructions.
            </h2>
        </div>

        <form className="text-white gap-[25px]">
            <label>Email</label>
            <input className="forgot-password-input" type="username" placeholder="rapidganteng@gmail.com"/>

            <div className="bottom-button-wrapper flex flex-col items-center  gap-10">
            <Link href={"/"} className="bot-button">
                Reset Password
            </Link>
            <Link href={"/"} className="btl">
                Back to Login
            </Link>
            </div>
        </form>
      </div>
    </div>
    );
}