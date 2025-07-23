"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Search, Plus } from "lucide-react"
import Link from "next/link"
import { BookCard } from "@/components/book-card"
import { Navigation } from "@/components/navigation"
import { useAppStore } from "@/lib/store"
import { useRouter } from "next/navigation"

export default function FeedPage() {
  const { isAuthenticated, books } = useAppStore()
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFormat, setSelectedFormat] = useState("all")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const filteredBooks = useMemo(() => {
    const filtered = books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFormat = selectedFormat === "all" || book.format.toLowerCase() === selectedFormat.toLowerCase()
      const matchesGenre = selectedGenre === "all" || book.genre.toLowerCase().includes(selectedGenre.toLowerCase())

      return matchesSearch && matchesFormat && matchesGenre && book.isAvailable
    })

    // Sort books
    switch (sortBy) {
      case "popular":
        return filtered.sort((a, b) => b.likes - a.likes)
      case "nearby":
        return filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0))
      case "requests":
        return filtered.sort((a, b) => b.requests - a.requests)
      default:
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
  }, [books, searchQuery, selectedFormat, selectedGenre, sortBy])

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push("/auth")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Feed</h1>
            <p className="text-gray-600">Discover and share amazing books with the community</p>
          </div>
          <Link href="/add-book">
            <Button className="bg-green-600 hover:bg-green-700 mt-4 md:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              Add Book
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search books, authors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Formats</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="physical">Physical</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    <SelectItem value="fiction">Fiction</SelectItem>
                    <SelectItem value="non-fiction">Non-fiction</SelectItem>
                    <SelectItem value="science">Science Fiction</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="self-help">Self-Help</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="nearby">Nearby</SelectItem>
                    <SelectItem value="requests">Most Requested</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedFormat("all")
                setSelectedGenre("all")
                setSortBy("newest")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
