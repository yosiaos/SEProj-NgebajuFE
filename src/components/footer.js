import Link from "next/link.js"
import * as Font from "../components/fonts.js"

export default function Footer() {

    return(
        <footer className="flex flex-row justify-between items-center bg-black mt-20 p-16">
            <div className="flex flex-col gap-5">
                <h1 className={`${Font.dmSerifDisplay.className} text-6xl`}>Ngebaju</h1>
                <p className="text-xl">Not just clothing, <br/> but identity.</p>
            </div>
            <div className="flex flex-row justify-between gap-20  mx-20">
                <div className="border-l-2 px-20 p-5">
                    <h1 className="mb-3 text-2xl font-bold">Menu</h1>
                    <div className="flex flex-col text-xl gap-y-2">
                        <Link href={"/"}>Home</Link>
                        <Link href={"/"}>Shop</Link>
                        <Link href={"/"}>About Us</Link>
                        <Link href={"/"}>Profile</Link>
                    </div>
                </div>
                <div  className="border-l-2 border-r-2 px-20 p-5">
                    <h1 className="mb-3 text-2xl font-bold">Follow Us</h1>
                    <div className="flex flex-col text-xl gap-y-2">
                        <Link href={"/"}>Instagram</Link>
                        <Link href={"/"}>TikTok</Link>
                        <Link href={"/"}>Fesnuk</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}