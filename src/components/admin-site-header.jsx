"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Cookies from "js-cookie"; // Ensure you have js-cookie installed

export function AdminSiteHeader() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("No file chosen");
  const API = process.env.NEXT_PUBLIC_API_URL;

  const handleFileChange = (e) => {

    const selected = e.target.files?.[0];
    if (selected) {
    setFile(selected);
    setFileName(selected.name); // 👈 show file name
  }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);

      console.log("Sending token:", Cookies.get("token"));
      const res = await fetch(`${API}/api/consents/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("token") || ""}`, // JWT stored in localStorage
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Upload failed");

      alert("File uploaded successfully!");
      setFile(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <header className="flex h-[--header-height] py-3 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[--header-height]">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">Document</h1>
        <div className="ml-auto flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="cursor-pointer">
                Upload Consent Form
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Upload the Organization Consent Form</h4>
                  <p className="text-sm text-muted-foreground">
                    Supported format: PDF, JPG, PNG. Max size: 5MB.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="document">Document</Label>
                    <Input
                      id="document"
                      type="file"
                      accept=".pdf, .png, .jpg, .jpeg"
                      onChange={handleFileChange}
                      className="col-span-2 h-8 cursor-pointer"
                    />
                  </div>
                  {/* 👇 Add this to show the file name */}
                  <p className="text-sm text-muted-foreground text-right mt-1 truncate">{fileName}</p>
                  <Button onClick={handleUpload} disabled={uploading} className={" cursor-pointer"}>
                    {uploading ? "Uploading..." : "Submit"}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
