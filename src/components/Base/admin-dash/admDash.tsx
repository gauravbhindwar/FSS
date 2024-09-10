"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { useRouter } from "next/navigation";

export default function AdminDash() {
  const links = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/admin/admProfile",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/admSettings",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "/",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-[100vw] flex-1 max-w-[100vw]  border border-neutral-200 dark:border-neutral-700 xl:overflow-hidden",
        "lg:h-screen h-[100vw]" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 ">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <div
                key={idx}
                onClick={() => {
                  
                  if (link.label === "Logout") {
                    fetch('/api/users/logout', {
                      method: 'POST',
                    })
                      .then(response => {
                        if (response.ok) {
                          // console.log('Logged out successfully', response);
                          router.push("/"); 
                          router.refresh(); // Force refresh cause doesnot work in second and subsequent instances
                        } else {
                          console.error('Failed to log out');
                        }
                      })
                      .catch(error => {
                        console.error('Error during logout:', error);
                      });
                  }
                }}
                
                >
                <SidebarLink
                  key={idx}
                  link={link}
                  
                />
                </div>
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <Image
                    src="./muj-logo.svg"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Admin Dashboard
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

// Dummy dashboard component with content
const Dashboard = () => {
  return (
    <div className="flex flex-1">
    <div
    className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-[rgb(255,78,80)] via-[rgb(255,140,50)] to-[rgb(249,212,35)] dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full"
    style={{
        backgroundImage: "url('./admin-Cover.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'right',
        backgroundRepeat: 'no-repeat',
    }}
    >
      <div className="max-w-5xl mx-auto xs:px-8">
        <HoverEffect items={Functions} />
        </div>
      </div>
    </div>
  );
};

export const Functions = [
    {
      title: "Manage Users",
      description:
        "Add, Remove or give Admin access to users",
      link: "/admin/manageUser",
    },
    {
      title: "Manage Courses",
      description:
        "Add, Remove or give Admin access to courses",
      link: "/admin/manageCourse",
    },
    {
      title: "Form Status",
      description:
        "Check all the forms filled so far and accept/reject them accordingly",
      link: "https://google.com",
    },
    {
      title: "Meta",
      description:
        "A technology company that focuses on building products that advance Facebook's mission of bringing the world closer together.",
      link: "https://meta.com",
    },
    {
      title: "Amazon",
      description:
        "A multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
      link: "https://amazon.com",
    },
    {
      title: "Microsoft",
      description:
        "A multinational technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.",
      link: "https://microsoft.com",
    },
  ];