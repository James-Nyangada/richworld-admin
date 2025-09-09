"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Cookies from "js-cookie"

const userInfo = Cookies.get("user");
const user = userInfo ? JSON.parse(userInfo) : null;

const name = user ? `${user.firstName} ${user.lastName}` : "Guest";
const email = user?.email ?? "";



const data = {
  user: {
    name: name,
    email: email,
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Overview",
      url: "/super-admin/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Schedule",
      url: "/super-admin/schedule",
      icon: IconListDetails,
    },
    {
      title: "Shows",
      url: "/super-admin/shows",
      icon: IconChartBar,
    },
    {
      title: "Blog Posts",
      url: "/super-admin/blog",
      icon: IconFolder,
    },
    {
      title: "Team",
      url: "/super-admin/team",
      icon: IconFileWord,
    },
    
    
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Stream Settings",
      url: "/super-admin/stream-settings",
      icon: IconSettings,
    },
    {
      title: "Settings",
      url: "/",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    /* {
      name: "Audit Logs",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "System Settings",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Billing and Plans",
      url: "/billing",
      icon: IconFileWord,
    }, */
    
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="/super-admin/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Wow Radio</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} className="cursor-pointer" />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
