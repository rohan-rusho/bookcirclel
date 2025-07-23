"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, MessageCircle, Download, Upload, Clock, CheckCircle, Star } from "lucide-react"
import { Navigation } from "@/components/navigation"
import Link from "next/link"

// Mock data
const myBooks = [
  {
    id: 1,
    title: "The Alchemist",
    author: "Paulo Coelho",
    format: "PDF",
    requests: 5,
    status: "active",
    coverUrl: "/placeholder.svg?height=150&width=100",
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    format: "Physical",
    requests: 3,
    status: "active",
    coverUrl: "/placeholder.svg?height=150&width=100",
  },
]

const myRequests = [
  {
    id: 1,
    book: {
      title: "Dune",
      author: "Frank Herbert",
      coverUrl: "/placeholder.svg?height=150&width=100",
    },
    owner: {
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    status: "pending",
    requestedAt: "2 hours ago",
  },
  {
    id: 2,
    book: {
      title: "Sapiens",
      author: "Yuval Noah Harari",
      coverUrl: "/placeholder.svg?height=150&width=100",
    },
    owner: {
      name: "Emma Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    status: "accepted",
    requestedAt: "1 day ago",
  },
]

const receivedRequests = [
  {
    id: 1,
    book: {
      title: "The Alchemist",
      author: "Paulo Coelho",
      coverUrl: "/placeholder.svg?height=150&width=100",
    },
    requester: {
      name: "Alex Thompson",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.7,
    },
    message: "Hi! I'd love to read this book. It's been on my list for a while.",
    requestedAt: "3 hours ago",
    status: "pending",
  },
]

const downloads = [
  {
    id: 1,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    downloadedAt: "2 days ago",
    coverUrl: "/placeholder.svg?height=150&width=100",
  },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("my-books")

  const handleRequestAction = (requestId: number, action: "accept" | "reject") => {
    // Handle request acceptance/rejection
    console.log(`${action} request ${requestId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your books, requests, and exchanges</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{myBooks.length}</p>
                  <p className="text-sm text-gray-600">Books Shared</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Upload className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{myRequests.length}</p>
                  <p className="text-sm text-gray-600">Requests Sent</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Download className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{receivedRequests.length}</p>
                  <p className="text-sm text-gray-600">Requests Received</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">4.8</p>
                  <p className="text-sm text-gray-600">Your Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="my-books">My Books</TabsTrigger>
            <TabsTrigger value="my-requests">My Requests</TabsTrigger>
            <TabsTrigger value="received">Received</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
            <TabsTrigger value="chats">Chats</TabsTrigger>
          </TabsList>

          <TabsContent value="my-books" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Books</h2>
              <Link href="/add-book">
                <Button className="bg-green-600 hover:bg-green-700">Add New Book</Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myBooks.map((book) => (
                <Card key={book.id}>
                  <CardContent className="p-4">
                    <div className="flex space-x-3">
                      <img
                        src={book.coverUrl || "/placeholder.svg"}
                        alt={book.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-1">{book.title}</h3>
                        <p className="text-xs text-gray-600 mb-2">by {book.author}</p>
                        <Badge className={book.format === "PDF" ? "bg-blue-500" : "bg-green-500"}>{book.format}</Badge>
                        <div className="mt-2 text-xs text-gray-500">{book.requests} requests</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-requests" className="space-y-4">
            <h2 className="text-xl font-semibold">My Requests</h2>

            <div className="space-y-4">
              {myRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={request.book.coverUrl || "/placeholder.svg"}
                        alt={request.book.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{request.book.title}</h3>
                        <p className="text-sm text-gray-600">by {request.book.author}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={request.owner.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                              {request.owner.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{request.owner.name}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={request.status === "accepted" ? "default" : "secondary"}
                          className={request.status === "accepted" ? "bg-green-500" : ""}
                        >
                          {request.status === "accepted" ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Accepted
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </>
                          )}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{request.requestedAt}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="received" className="space-y-4">
            <h2 className="text-xl font-semibold">Requests Received</h2>

            <div className="space-y-4">
              {receivedRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={request.book.coverUrl || "/placeholder.svg"}
                        alt={request.book.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{request.book.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">by {request.book.author}</p>

                        <div className="flex items-center space-x-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={request.requester.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                              {request.requester.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{request.requester.name}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{request.requester.rating}</span>
                          </div>
                        </div>

                        {request.message && (
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded mb-2">"{request.message}"</p>
                        )}

                        <p className="text-xs text-gray-500">{request.requestedAt}</p>
                      </div>

                      {request.status === "pending" && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleRequestAction(request.id, "accept")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Accept
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleRequestAction(request.id, "reject")}>
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="downloads" className="space-y-4">
            <h2 className="text-xl font-semibold">Downloaded Books</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {downloads.map((download) => (
                <Card key={download.id}>
                  <CardContent className="p-4">
                    <div className="flex space-x-3">
                      <img
                        src={download.coverUrl || "/placeholder.svg"}
                        alt={download.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-1">{download.title}</h3>
                        <p className="text-xs text-gray-600 mb-2">by {download.author}</p>
                        <p className="text-xs text-gray-500">{download.downloadedAt}</p>
                        <Button size="sm" className="mt-2 w-full">
                          <Download className="w-3 h-3 mr-1" />
                          Download Again
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="chats" className="space-y-4">
            <h2 className="text-xl font-semibold">Active Chats</h2>

            <Card>
              <CardContent className="p-4 text-center">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">No active chats</h3>
                <p className="text-gray-600 text-sm">Chats will appear here when your book requests are accepted</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
