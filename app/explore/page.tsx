"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Search, Filter, MapPin, BookOpen } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { BookCard } from "@/components/book-card"
import { useAppStore } from "@/lib/store"
import Link from "next/link"

export default function ExplorePage() {
  const { isAuthenticated, books } = useAppStore()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFormat, setSelectedFormat] = useState("all")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [maxDistance, setMaxDistance] = useState([100])
  const [showNearbyOnly, setShowNearbyOnly] = useState(false)

  const filteredBooks = useMemo(() => {
    const filtered = books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFormat = selectedFormat === "all" || book.format.toLowerCase() === selectedFormat.toLowerCase()
      const matchesGenre = selectedGenre === "all" || book.genre.toLowerCase().includes(selectedGenre.toLowerCase())
      const matchesLanguage =
        selectedLanguage === "all" || book.language.toLowerCase() === selectedLanguage.toLowerCase()
      const matchesDistance = !showNearbyOnly || (book.distance && book.distance <= maxDistance[0])

      return matchesSearch && matchesFormat && matchesGenre && matchesLanguage && matchesDistance && book.isAvailable
    })

    // Sort books
    switch (sortBy) {
      case "popular":
        return filtered.sort((a, b) => b.likes - a.likes)
      case "nearby":
        return filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0))
      case "rating":
        return filtered.sort((a, b) => b.owner.rating - a.owner.rating)
      default:
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
  }, [books, searchQuery, selectedFormat, selectedGenre, selectedLanguage, sortBy, maxDistance, showNearbyOnly])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Conditional Navigation - only show if authenticated */}
      {isAuthenticated ? (
        <Navigation />
      ) : (
        // Guest header for non-authenticated users
        <header className="border-b bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">BookCircle</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/auth">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth">
                <Button className="bg-green-600 hover:bg-green-700">Join Now</Button>
              </Link>
            </div>
          </div>
        </header>
      )}

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Books</h1>
          <p className="text-gray-600">
            Discover amazing books from the community
            {!isAuthenticated && (
              <span className="block text-sm text-green-600 mt-1">
                <Link href="/auth" className="underline">
                  Sign up
                </Link>{" "}
                to request books and join the community
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <Card className="sticky top-20">
              <CardContent className="p-4 space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </h3>
                </div>

                {/* Search */}
                <div className="space-y-2">
                  <Label>Search</Label>
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

                {/* Format Filter */}
                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Formats" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Formats</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="physical">Physical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Genre Filter */}
                <div className="space-y-2">
                  <Label>Genre</Label>
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Genres" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genres</SelectItem>
                      <SelectItem value="fiction">Fiction</SelectItem>
                      <SelectItem value="non-fiction">Non-fiction</SelectItem>
                      <SelectItem value="science">Science Fiction</SelectItem>
                      <SelectItem value="classic">Classic Literature</SelectItem>
                      <SelectItem value="self-help">Self-Help</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Language Filter */}
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Languages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Languages</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Distance Filter */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Distance (km)</Label>
                    <Badge variant="outline">{maxDistance[0]} km</Badge>
                  </div>
                  <Slider
                    value={maxDistance}
                    onValueChange={setMaxDistance}
                    max={1000}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="nearby-only"
                      checked={showNearbyOnly}
                      onChange={(e) => setShowNearbyOnly(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="nearby-only" className="text-sm">
                      Physical books only
                    </Label>
                  </div>
                </div>

                {/* Sort */}
                <div className="space-y-2">
                  <Label>Sort by</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="nearby">Nearest</SelectItem>
                      <SelectItem value="rating">Highest Rated Owner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedFormat("all")
                    setSelectedGenre("all")
                    setSelectedLanguage("all")
                    setMaxDistance([100])
                    setShowNearbyOnly(false)
                    setSortBy("newest")
                  }}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Books Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">
                {filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {filteredBooks.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <div key={book.id} className="relative">
                    <BookCard book={book} />
                    {book.distance && book.distance < 10 && (
                      <Badge className="absolute top-2 left-2 bg-green-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {book.distance}km
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No books found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedFormat("all")
                    setSelectedGenre("all")
                    setSelectedLanguage("all")
                    setShowNearbyOnly(false)
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
