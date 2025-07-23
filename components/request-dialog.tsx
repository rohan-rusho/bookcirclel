"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Send } from "lucide-react"
import { useAppStore, type Book } from "@/lib/store"
import { toast } from "sonner"

interface RequestDialogProps {
  book: Book
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RequestDialog({ book, open, onOpenChange }: RequestDialogProps) {
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, sendRequest } = useAppStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)

    // Simulate request submission
    setTimeout(() => {
      sendRequest(
        book.id,
        message || `Hi! I'd love to read "${book.title}". When would be a good time for the exchange?`,
      )
      setIsSubmitting(false)
      onOpenChange(false)
      setMessage("")
      toast.success("Request sent successfully!")
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Book</DialogTitle>
          <DialogDescription>Send a request to borrow this book</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Book Info */}
          <div className="flex space-x-3 p-3 bg-gray-50 rounded-lg">
            <img
              src={book.coverUrl || "/placeholder.svg"}
              alt={book.title}
              className="w-16 h-20 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm line-clamp-1">{book.title}</h4>
              <p className="text-xs text-gray-600 mb-1">by {book.author}</p>
              <Badge size="sm" className={book.format === "PDF" ? "bg-blue-500" : "bg-green-500"}>
                {book.format}
              </Badge>
            </div>
          </div>

          {/* Owner Info */}
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={book.owner.avatar || "/placeholder.svg"} alt={book.owner.name} />
              <AvatarFallback>
                {book.owner.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-sm">{book.owner.name}</p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{book.owner.rating}</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{book.owner.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Request Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder={`Hi! I'd love to read "${book.title}". When would be a good time for the exchange?`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1 bg-green-600 hover:bg-green-700">
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Request
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
