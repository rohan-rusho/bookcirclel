"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload, BookOpen, Camera, FileText, LinkIcon } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"

export default function AddBookPage() {
  const { user, isAuthenticated, addBook } = useAppStore()
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    description: "",
    format: "PDF" as "PDF" | "Physical",
    genre: "",
    language: "English",
    coverImage: null as File | null,
    pdfUrl: "", // For PDF sharing link
  })

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    router.push("/auth")
    return null
  }

  const handleInputChange = (field: string, value: string) => {
    setBookData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast.error("Image file too large. Please choose a file under 10MB.")
        return
      }
      setBookData((prev) => ({ ...prev, coverImage: file }))
      toast.success("Cover image uploaded successfully!")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!bookData.title.trim()) {
      toast.error("Please enter a book title")
      return
    }

    if (!bookData.author.trim()) {
      toast.error("Please enter the author's name")
      return
    }

    if (!bookData.genre) {
      toast.error("Please select a genre")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate file upload and processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create cover URL (in real app, this would be uploaded to cloud storage)
      const coverUrl = bookData.coverImage
        ? `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(bookData.title)}`
        : `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(bookData.title)}`

      // Add book to store
      addBook({
        title: bookData.title.trim(),
        author: bookData.author.trim(),
        description: bookData.description.trim() || `A ${bookData.genre.toLowerCase()} book by ${bookData.author}`,
        format: bookData.format,
        genre: bookData.genre,
        language: bookData.language,
        coverUrl,
      })

      toast.success("Book added successfully! 🎉")

      // Reset form
      setBookData({
        title: "",
        author: "",
        description: "",
        format: "PDF",
        genre: "",
        language: "English",
        coverImage: null,
        pdfUrl: "",
      })

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (error) {
      toast.error("Failed to add book. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Book</h1>
          <p className="text-gray-600">Share a book with the BookCircle community</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Book Details
            </CardTitle>
            <CardDescription>Fill in the information about the book you want to share</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Book Format */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Book Format *</Label>
                <RadioGroup
                  value={bookData.format}
                  onValueChange={(value: "PDF" | "Physical") => handleInputChange("format", value)}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="PDF" id="pdf" />
                    <Label htmlFor="pdf" className="flex items-center cursor-pointer">
                      <FileText className="w-4 h-4 mr-2 text-blue-600" />
                      PDF (Digital)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Physical" id="physical" />
                    <Label htmlFor="physical" className="flex items-center cursor-pointer">
                      <BookOpen className="w-4 h-4 mr-2 text-green-600" />
                      Physical Book
                    </Label>
                  </div>
                </RadioGroup>
                <p className="text-xs text-gray-500">
                  {bookData.format === "PDF"
                    ? "Digital books can be shared instantly with other users"
                    : "Physical books require meetup or shipping arrangements"}
                </p>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-medium">
                  Book Title *
                </Label>
                <Input
                  id="title"
                  value={bookData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter the book title"
                  required
                />
              </div>

              {/* Author */}
              <div className="space-y-2">
                <Label htmlFor="author" className="text-base font-medium">
                  Author *
                </Label>
                <Input
                  id="author"
                  value={bookData.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  placeholder="Enter the author's name"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={bookData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Brief description of the book (optional)"
                  rows={3}
                />
              </div>

              {/* Genre */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Genre *</Label>
                <Select value={bookData.genre} onValueChange={(value) => handleInputChange("genre", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fiction">Fiction</SelectItem>
                    <SelectItem value="Non-fiction">Non-fiction</SelectItem>
                    <SelectItem value="Science Fiction">Science Fiction</SelectItem>
                    <SelectItem value="Fantasy">Fantasy</SelectItem>
                    <SelectItem value="Mystery">Mystery</SelectItem>
                    <SelectItem value="Romance">Romance</SelectItem>
                    <SelectItem value="Thriller">Thriller</SelectItem>
                    <SelectItem value="Biography">Biography</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="Self-Help">Self-Help</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Classic Literature">Classic Literature</SelectItem>
                    <SelectItem value="Poetry">Poetry</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Language */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Language *</Label>
                <Select value={bookData.language} onValueChange={(value) => handleInputChange("language", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Italian">Italian</SelectItem>
                    <SelectItem value="Portuguese">Portuguese</SelectItem>
                    <SelectItem value="Chinese">Chinese</SelectItem>
                    <SelectItem value="Japanese">Japanese</SelectItem>
                    <SelectItem value="Korean">Korean</SelectItem>
                    <SelectItem value="Arabic">Arabic</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-3">
                <Label htmlFor="cover-image" className="text-base font-medium">
                  Book Cover Photo {bookData.format === "PDF" ? "*" : "(Optional)"}
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    id="cover-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Label htmlFor="cover-image" className="cursor-pointer">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      {bookData.coverImage ? `✓ ${bookData.coverImage.name}` : "Click to upload book cover photo"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {bookData.format === "PDF"
                        ? "Required: Upload a photo of the book cover or screenshot"
                        : "Optional: Take a photo of your physical book"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                  </Label>
                </div>
              </div>

              {/* PDF Sharing Info */}
              {bookData.format === "PDF" && (
                <div className="space-y-3">
                  <Label className="text-base font-medium">PDF Sharing</Label>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <LinkIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">How PDF sharing works</h4>
                        <p className="text-sm text-blue-700 mb-2">
                          When someone requests your PDF book, you'll receive their contact information to share the
                          file directly. This ensures copyright compliance and builds community trust.
                        </p>
                        <ul className="text-xs text-blue-600 space-y-1">
                          <li>• Share via email, cloud storage, or messaging</li>
                          <li>• Connect directly with readers</li>
                          <li>• Build your reputation in the community</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Physical Book Info */}
              {bookData.format === "Physical" && (
                <div className="space-y-3">
                  <Label className="text-base font-medium">Physical Book Exchange</Label>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <BookOpen className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900 mb-1">How physical sharing works</h4>
                        <p className="text-sm text-green-700 mb-2">
                          Connect with nearby readers to exchange physical books. Arrange meetups in safe public places
                          or discuss shipping options.
                        </p>
                        <ul className="text-xs text-green-600 space-y-1">
                          <li>• Meet in public places like libraries or cafes</li>
                          <li>• Discuss book condition and return timeline</li>
                          <li>• Build local reading communities</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !bookData.title || !bookData.author || !bookData.genre}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <Upload className="w-4 h-4 mr-2 animate-spin" />
                      Adding Book...
                    </>
                  ) : (
                    "Add Book"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
