"use client"

import * as React from "react"
import { format } from "date-fns"
import { CircleIcon, FilterIcon, FlagIcon, InboxIcon, MoreHorizontalIcon, SearchIcon, UserIcon } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function MessageList({ conversations, onSelectConversation }) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedStatus, setSelectedStatus] = React.useState("all")
  const [selectedPriority, setSelectedPriority] = React.useState("all")
  const [selectedTags, setSelectedTags] = React.useState([])

  // Get all unique tags from conversations
  const allTags = React.useMemo(() => {
    const tags = new Set()
    conversations.forEach((conversation) => {
      conversation.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags)
  }, [conversations])

  // Filter conversations based on search, status, priority, and tags
  const filteredConversations = React.useMemo(() => {
    return conversations.filter((conversation) => {
      // Filter by search query
      const matchesSearch =
        searchQuery === "" ||
        conversation.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conversation.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conversation.contact.name.toLowerCase().includes(searchQuery.toLowerCase())

      // Filter by status
      const matchesStatus = selectedStatus === "all" || conversation.status === selectedStatus

      // Filter by priority
      const matchesPriority = selectedPriority === "all" || conversation.priority === selectedPriority

      // Filter by tags
      const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => conversation.tags.includes(tag))

      return matchesSearch && matchesStatus && matchesPriority && matchesTags
    })
  }, [conversations, searchQuery, selectedStatus, selectedPriority, selectedTags])

  // Count conversations by status
  const openCount = conversations.filter((c) => c.status === "open").length
  const archivedCount = conversations.filter((c) => c.status === "archived").length

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <InboxIcon className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Inbox</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => toast.success("Support logs exported successfully")}
          >
            Export Logs
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <MoreHorizontalIcon className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark all as read</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex items-center gap-2 border-b p-4">
        <SearchIcon className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search messages..."
          className="h-8 border-none bg-transparent p-0 focus-visible:ring-0"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Tabs defaultValue="all" className="flex-1">
        <div className="flex items-center justify-between border-b px-4">
          <TabsList className="h-12 w-full justify-start rounded-none border-b-0 bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="rounded-none border-b-2 border-transparent px-4 py-1 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="open"
              className="rounded-none border-b-2 border-transparent px-4 py-1 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Open <Badge className="ml-1 rounded-full">{openCount}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="archived"
              className="rounded-none border-b-2 border-transparent px-4 py-1 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Archived <Badge className="ml-1 rounded-full">{archivedCount}</Badge>
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <FilterIcon className="h-3.5 w-3.5" />
                  <span>Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={selectedStatus === "all"}
                  onCheckedChange={() => setSelectedStatus("all")}
                >
                  All
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedStatus === "open"}
                  onCheckedChange={() => setSelectedStatus("open")}
                >
                  Open
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedStatus === "archived"}
                  onCheckedChange={() => setSelectedStatus("archived")}
                >
                  Archived
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={selectedPriority === "all"}
                  onCheckedChange={() => setSelectedPriority("all")}
                >
                  All
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedPriority === "critical"}
                  onCheckedChange={() => setSelectedPriority("critical")}
                >
                  Critical
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedPriority === "high"}
                  onCheckedChange={() => setSelectedPriority("high")}
                >
                  High
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedPriority === "medium"}
                  onCheckedChange={() => setSelectedPriority("medium")}
                >
                  Medium
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedPriority === "low"}
                  onCheckedChange={() => setSelectedPriority("low")}
                >
                  Low
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Filter by Tags</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {allTags.map((tag) => (
                  <DropdownMenuCheckboxItem
                    key={tag}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedTags([...selectedTags, tag])
                      } else {
                        setSelectedTags(selectedTags.filter((t) => t !== tag))
                      }
                    }}
                  >
                    {tag}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <TabsContent value="all" className="flex-1 p-0">
          <ConversationList conversations={filteredConversations} onSelectConversation={onSelectConversation} />
        </TabsContent>
        <TabsContent value="open" className="flex-1 p-0">
          <ConversationList
            conversations={filteredConversations.filter((c) => c.status === "open")}
            onSelectConversation={onSelectConversation}
          />
        </TabsContent>
        <TabsContent value="archived" className="flex-1 p-0">
          <ConversationList
            conversations={filteredConversations.filter((c) => c.status === "archived")}
            onSelectConversation={onSelectConversation}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ConversationList({ conversations, onSelectConversation }) {
  if (conversations.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <InboxIcon className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No conversations found</h3>
        <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[calc(100vh-13rem)]">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          onSelect={() => onSelectConversation(conversation)}
        />
      ))}
    </ScrollArea>
  )
}

function ConversationItem({ conversation, onSelect }) {
  const lastMessage = conversation.messages[conversation.messages.length - 1]
  const lastActivityDate = new Date(conversation.lastActivity)
  const formattedDate = format(lastActivityDate, "MMM d")
  const isToday = new Date().toDateString() === lastActivityDate.toDateString()
  const displayDate = isToday ? format(lastActivityDate, "h:mm a") : formattedDate

  return (
    <div
      className={`flex cursor-pointer flex-col border-b p-4 hover:bg-muted/50 ${
        conversation.unread ? "bg-muted/30" : ""
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">{conversation.contact.name}</span>
          {conversation.unread && <CircleIcon className="h-2 w-2 fill-primary text-primary" />}
        </div>
        <div className="flex items-center gap-2">
          {conversation.priority === "critical" && <FlagIcon className="h-4 w-4 text-destructive" />}
          {conversation.priority === "high" && <FlagIcon className="h-4 w-4 text-amber-500" />}
          <span className="text-xs text-muted-foreground">{displayDate}</span>
        </div>
      </div>
      <div className="mt-1">
        <h3 className="font-medium">{conversation.subject}</h3>
        <p className="line-clamp-1 text-sm text-muted-foreground">{lastMessage.content}</p>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Badge variant="outline" className="text-xs">
          {conversation.company}
        </Badge>
        {conversation.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}
