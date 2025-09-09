"use client"

import * as React from "react"
import { format } from "date-fns"
import {
  ArchiveIcon,
  ArrowLeftIcon,
  DownloadIcon,
  FileIcon,
  FlagIcon,
  MoreHorizontalIcon,
  PaperclipIcon,
  SendIcon,
  TagIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"

export function ConversationView({ conversation, onBack, onArchive }) {
  const [replyText, setReplyText] = React.useState("")
  const [isReplying, setIsReplying] = React.useState(false)
  const scrollAreaRef = React.useRef(null)

  // Scroll to bottom when conversation changes
  React.useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current
      scrollArea.scrollTop = scrollArea.scrollHeight
    }
  }, [conversation])

  const handleSendReply = () => {
    if (!replyText.trim()) return

    setIsReplying(true)
    // Simulate sending reply
    setTimeout(() => {
      toast.success("Reply sent successfully")
      setReplyText("")
      setIsReplying(false)
    }, 1000)
  }

  const handleArchive = () => {
    onArchive(conversation.id)
    toast.success(`Conversation "${conversation.subject}" archived`)
  }

  const handleAddTag = (tag) => {
    toast.success(`Tag "${tag}" added to conversation`)
  }

  if (!conversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <h3 className="text-lg font-medium">Select a conversation</h3>
        <p className="mt-2 text-sm text-muted-foreground">Choose a conversation from the list to view it here.</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h2 className="text-lg font-semibold">{conversation.subject}</h2>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <TagIcon className="h-3.5 w-3.5" />
                <span>Tag</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleAddTag("urgent")}>
                <FlagIcon className="mr-2 h-4 w-4 text-red-500" />
                Urgent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddTag("bug")}>
                <TagIcon className="mr-2 h-4 w-4" />
                Bug
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddTag("feature")}>
                <TagIcon className="mr-2 h-4 w-4" />
                Feature Request
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddTag("billing")}>
                <TagIcon className="mr-2 h-4 w-4" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Create New Tag...</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="h-8" onClick={handleArchive}>
            <ArchiveIcon className="mr-2 h-3.5 w-3.5" />
            Archive
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <MoreHorizontalIcon className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark as unread</DropdownMenuItem>
              <DropdownMenuItem>Assign to team member</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Delete conversation</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={conversation.contact.avatar || "/placeholder.svg"} alt={conversation.contact.name} />
            <AvatarFallback>{conversation.contact.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{conversation.contact.name}</span>
              <Badge variant="outline">{conversation.contact.role}</Badge>
            </div>
            <span className="text-xs text-muted-foreground">{conversation.contact.email}</span>
          </div>
        </div>
        <div>
          <Badge variant="outline">{conversation.company}</Badge>
        </div>
      </div>
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="flex flex-col gap-6 p-4">
          {conversation.messages.map((message) => (
            <div key={message.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
                    <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{message.sender.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(message.timestamp), "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
              <div className="ml-10 rounded-lg bg-muted/50 p-4">
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                {message.attachments.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">Attachments:</p>
                    <div className="flex flex-wrap gap-2">
                      {message.attachments.map((attachment) => (
                        <div
                          key={attachment.name}
                          className="flex items-center gap-2 rounded-md border bg-background p-2"
                        >
                          <FileIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs">{attachment.name}</span>
                          <span className="text-xs text-muted-foreground">({attachment.size})</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <DownloadIcon className="h-3 w-3" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex flex-col gap-4 rounded-lg border bg-background p-4">
          <Textarea
            placeholder="Type your reply..."
            className="min-h-[100px] resize-none border-0 p-0 focus-visible:ring-0"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <PaperclipIcon className="h-3.5 w-3.5" />
              <span>Attach</span>
            </Button>
            <Button className="gap-1" onClick={handleSendReply} disabled={!replyText.trim() || isReplying}>
              {isReplying ? "Sending..." : "Send Reply"}
              <SendIcon className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
