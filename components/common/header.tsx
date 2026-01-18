"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "../theme-toggle";

const Header = () => {
  const { theme } = useTheme();
  return (
    <header className="fixed top-0 z-50 w-full ">
      <div className="dark:bg-neutral-950/50 backdrop-blur-2xl w-full py-5 px-15 border-b dark:border-neutral-600/50 bg-neutral-200/20 border-neutral-300 flex justify-between items-center">
        <Link href={"/"}>
          {theme === "light" ? (
            <Image
              src="/blacklogo.webp"
              alt="logo"
              width={120}
              height={40}
              priority
              className="min-w-24 object-cover"
            ></Image>
          ) : (
            <Image
              src="/whitelogo.webp"
              alt="logo"
              width={120}
              height={40}
              priority
              className="min-w-24 object-cover"
            ></Image>
          )}
        </Link>
        <div className="md:flex hidden ">
          <ul className="flex gap-4 text-xl">
            <li>
              <Link
                href={"/feature"}
                className="dark:hover:text-neutral-400 hover:text-neutral-500 transition-all duration-200 cursor-pointer "
              >
                Feature
              </Link>
            </li>{" "}
            <li>
              <Link
                href={"/pricing"}
                className="dark:hover:text-neutral-400 hover:text-neutral-500 transition-all duration-200 cursor-pointer "
              >
                Pricing
              </Link>
            </li>{" "}
            <li>
              <Link
                href={"/contact"}
                className="dark:hover:text-neutral-400 hover:text-neutral-500 transition-all duration-200 cursor-pointer "
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex items-center gap-4">
          Auth
          <span>
            <ModeToggle />
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
