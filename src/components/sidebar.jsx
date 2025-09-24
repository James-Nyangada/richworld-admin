"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Cookies from "js-cookie"
import { cn } from "@/lib/utils"
import {
  Calendar,
  Radio,
  Users,
  FileText,
  Settings,
  BarChart3,
  Search,
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  LogOut,
} from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const navigation = [
  { name: "Overview", href: "/super-admin/dashboard", icon: BarChart3 },
  { name: "Schedule", href: "/super-admin/schedule", icon: Calendar },
  { name: "Shows", href: "/super-admin/shows", icon: Radio },
  { name: "Blog Posts", href: "/super-admin/blog", icon: FileText },
  { name: "Team", href: "/super-admin/team", icon: Users },
  { name: "Stream Settings", href: "/super-admin/stream-settings", icon: Settings },
  { name: "Settings", href: "/super-admin/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter();
  
    const handleLogout = () => {
     Cookies.remove("token", { path: "/" });
      Cookies.remove("role", { path: "/" });
      router.push("/login");
    }


      const userInfo = Cookies.get("user");
      const OrganizationInfo = Cookies.get("Organization");
      const organizationDetail = OrganizationInfo ? JSON.parse(OrganizationInfo) : null;
      const userDetail = userInfo ? JSON.parse(userInfo) : null;
    
      const name = userDetail ? `${userDetail.firstName} ${userDetail.lastName}` : "Guest";
      const email = userDetail?.email ?? "";
      

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden bg-background/80 backdrop-blur-sm"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <div
        className={cn(
          "fixed md:static inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border transform transition-all duration-300 ease-in-out md:transform-none",
          isCollapsed ? "w-20" : "w-64",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <Button
          variant="ghost"
          size="sm"
          className="hidden md:flex absolute -right-3 top-6 z-10 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </Button>

        <div className={cn("p-6 transition-all duration-300", isCollapsed && "px-3")}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200">
              <Radio className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-lg text-sidebar-foreground animate-in slide-in-from-left-2 duration-200">
               Richworld Safaris
              </span>
            )}
          </div>
        </div>

        <nav className="px-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 text-sm rounded-lg transition-all duration-200 hover:scale-105 group relative",
                  isActive
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 border-l-4 border-blue-500 shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed && "justify-center px-2",
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed ? (
                  <span className="font-medium animate-in slide-in-from-left-2 duration-200">{item.name}</span>
                ) : (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        <div
          className={cn(
            "absolute bottom-4 left-4 right-4 transition-all duration-300",
            isCollapsed && "left-2 right-2",
          )}
        >
          <div
            className={cn(
              "flex items-center gap-3 p-4 bg-gradient-to-r from-sidebar-accent to-sidebar-accent/80 rounded-xl shadow-sm hover:shadow-md transition-all duration-200",
              isCollapsed && "flex-col gap-2 p-2",
            )}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200">
              <User className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 animate-in slide-in-from-left-2 duration-200">
                <p className="text-sm font-semibold text-sidebar-accent-foreground">{name}</p>
                <p className="text-xs text-sidebar-accent-foreground/70 truncate">{email}</p>
              </div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0 hover:bg-sidebar-accent-foreground/10 transition-colors duration-200",
                    isCollapsed && "mt-1",
                  )}
                >
                  <MoreVertical className="w-4 h-4 text-sidebar-accent-foreground/70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 animate-in slide-in-from-bottom-2 duration-200">
                <DropdownMenuItem className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 cursor-pointer">
                  <LogOut className="w-4 h-4" />
                  <Button onClick={handleLogout}>Logout</Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  )
}
