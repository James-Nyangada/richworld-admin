
import Image from "next/image"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { GalleryVerticalEnd } from "lucide-react";
import { Button } from "@/components/ui/button"


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
        <a href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Wow Radio
          </a>
        </div>
        
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Welcome to RichWorld Admin Panel,
              <br />
              the Ultimate Dashboard.
            </h1>
            <p className="text-gray-600 mb-8">
              Manage your travel packages, testimonials, and user roles with ease.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/login"
                
              >
              <Button variant="default" className="bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90">
                Login
              </Button>
                
              </Link>
              <Link
                href="/login"
                
              >
              {/* <Button variant="default" className="bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90">
                Sign Up
              </Button> */}
                
              </Link>
              
            </div>
          </div>
          <div className="relative">
            <Image
              src="/hero-safari.jpg"
              alt="Isomorphic Dashboard on laptop and mobile"
              width={600}
              height={500}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 flex justify-center">
        <div className="flex gap-4">
          <Link href="#" className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
            <Facebook className="h-5 w-5 text-gray-500" />
            <span className="sr-only">Facebook</span>
          </Link>
          <Link href="#" className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
            <Twitter className="h-5 w-5 text-gray-500" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link href="#" className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
            <Instagram className="h-5 w-5 text-gray-500" />
            <span className="sr-only">Instagram</span>
          </Link>
          <Link href="#" className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
            <Youtube className="h-5 w-5 text-gray-500" />
            <span className="sr-only">YouTube</span>
          </Link>
        </div>
      </footer>
    </div>
  )
}
