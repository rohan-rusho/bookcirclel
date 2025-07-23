"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Star, MapPin } from "lucide-react"
import { RequestDialog } from "./request-dialog"
import { useAppStore, type Book } from "@/lib/store"
import { toast } from "sonner"

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const { user, likeBook } = useAppStore()

  const handleLike = () => {
    if (!user) {
      toast.error("Sign up to like books and join the community!")
      return
    }

    setIsLiked(!isLiked)
    likeBook(book.id)
    toast.success(isLiked ? "Removed from favorites" : "Added to favorites")
  }

  const handleRequestClick = () => {
    if (!user) {
      toast.error("Sign up to request books and connect with readers!")
      return
    }

    if (book.owner.id === user.id) {
      toast.error("You cannot request your own book")
      return
    }

    setShowRequestDialog(true)
  }

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
        <div className="relative">
          <img
            src={book.coverUrl || "/placeholder.svg"}
            alt={book.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <Badge className={`absolute top-2 right-2 ${book.format === "PDF" ? "bg-blue-500" : "bg-green-500"}`}>
            {book.format}
          </Badge>
          {book.distance && book.distance < 10 && (
            <Badge className="absolute top-2 left-2 bg-orange-500">
              <MapPin className="w-3 h-3 mr-1" />
              {book.distance}km
            </Badge>
          )}
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-lg line-clamp-1">{book.title}</CardTitle>
          <CardDescription className="text-sm text-gray-600">by {book.author}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-gray-700 line-clamp-2">{book.description}</p>

          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              {book.genre}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {book.language}
            </Badge>
          </div>

          {/* Owner Info */}
          <div className="flex items-center space-x-2 pt-2 border-t">
            <Avatar className="h-6 w-6">
              <AvatarImage src={book.owner.avatar || "/placeholder.svg"} alt={book.owner.name} />
              <AvatarFallback className="text-xs">
                {book.owner.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{book.owner.name}</p>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{book.owner.rating}</span>
                <span>•</span>
                <MapPin className="h-3 w-3" />
                <span className="truncate">{book.owner.location}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`p-1 h-auto ${isLiked ? "text-red-500" : "text-gray-500"}`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                <span className="ml-1 text-xs">{book.likes + (isLiked ? 1 : 0)}</span>
              </Button>
              <div className="flex items-center text-gray-500">
                <MessageCircle className="h-4 w-4" />
                <span className="ml-1 text-xs">{book.requests}</span>
              </div>
            </div>

            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={handleRequestClick}
              disabled={book.owner.id === user?.id}
            >
              {book.owner.id === user?.id ? "Your Book" : !user ? "Sign Up to Request" : "Request"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <RequestDialog book={book} open={showRequestDialog} onOpenChange={setShowRequestDialog} />
    </>
  )
}
