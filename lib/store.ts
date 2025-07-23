"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  location: string
  rating: number
  booksShared: number
  booksReceived: number
  joinedAt: string
}

export interface Book {
  id: string
  title: string
  author: string
  description: string
  format: "PDF" | "Physical"
  genre: string
  language: string
  coverUrl: string
  owner: User
  likes: number
  requests: number
  distance?: number
  createdAt: string
  isAvailable: boolean
}

export interface BookRequest {
  id: string
  bookId: string
  book: Book
  requesterId: string
  requester: User
  ownerId: string
  owner: User
  message: string
  status: "pending" | "accepted" | "rejected" | "completed"
  createdAt: string
  updatedAt: string
}

export interface Chat {
  id: string
  participants: User[]
  bookId: string
  book: Book
  messages: Message[]
  lastMessage?: Message
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  chatId: string
  senderId: string
  sender: User
  content: string
  type: "text" | "file" | "system"
  createdAt: string
}

interface AppState {
  // Auth
  user: User | null
  isAuthenticated: boolean

  // Books
  books: Book[]
  myBooks: Book[]

  // Requests
  sentRequests: BookRequest[]
  receivedRequests: BookRequest[]

  // Chats
  chats: Chat[]

  // UI State
  notifications: number

  // Actions
  login: (user: User) => void
  logout: () => void
  addBook: (book: Omit<Book, "id" | "owner" | "likes" | "requests" | "createdAt" | "isAvailable">) => void
  updateBook: (id: string, updates: Partial<Book>) => void
  deleteBook: (id: string) => void
  likeBook: (bookId: string) => void
  sendRequest: (bookId: string, message: string) => void
  respondToRequest: (requestId: string, status: "accepted" | "rejected") => void
  addChat: (chat: Omit<Chat, "id" | "createdAt" | "updatedAt">) => void
  sendMessage: (chatId: string, content: string) => void
  setNotifications: (count: number) => void
}

// Mock users for book owners
const mockUsers: User[] = [
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=SJ",
    location: "New York, NY",
    rating: 4.8,
    booksShared: 15,
    booksReceived: 12,
    joinedAt: "2024-01-10",
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=MC",
    location: "San Francisco, CA",
    rating: 4.9,
    booksShared: 20,
    booksReceived: 18,
    joinedAt: "2024-01-05",
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=EW",
    location: "London, UK",
    rating: 4.7,
    booksShared: 8,
    booksReceived: 10,
    joinedAt: "2024-01-12",
  },
]

// Mock books
const mockBooks: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A classic American novel about the Jazz Age",
    format: "PDF",
    genre: "Classic Literature",
    language: "English",
    coverUrl: "/placeholder.svg?height=300&width=200&text=The+Great+Gatsby",
    owner: mockUsers[0],
    likes: 24,
    requests: 8,
    distance: 2.5,
    createdAt: "2024-01-20",
    isAvailable: true,
  },
  {
    id: "2",
    title: "Dune",
    author: "Frank Herbert",
    description: "Epic science fiction novel set in a distant future",
    format: "Physical",
    genre: "Science Fiction",
    language: "English",
    coverUrl: "/placeholder.svg?height=300&width=200&text=Dune",
    owner: mockUsers[1],
    likes: 42,
    requests: 15,
    distance: 15.2,
    createdAt: "2024-01-18",
    isAvailable: true,
  },
  {
    id: "3",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    description: "A brief history of humankind",
    format: "PDF",
    genre: "Non-fiction",
    language: "English",
    coverUrl: "/placeholder.svg?height=300&width=200&text=Sapiens",
    owner: mockUsers[2],
    likes: 38,
    requests: 12,
    distance: 3000,
    createdAt: "2024-01-16",
    isAvailable: true,
  },
]

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      books: mockBooks,
      myBooks: [],
      sentRequests: [],
      receivedRequests: [],
      chats: [],
      notifications: 3,

      // Actions
      login: (user) => set({ user, isAuthenticated: true }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          myBooks: [],
          sentRequests: [],
          receivedRequests: [],
          chats: [],
        }),

      addBook: (bookData) => {
        const { user } = get()
        if (!user) return

        const newBook: Book = {
          ...bookData,
          id: Date.now().toString(),
          owner: user,
          likes: 0,
          requests: 0,
          createdAt: new Date().toISOString(),
          isAvailable: true,
        }

        set((state) => ({
          books: [newBook, ...state.books],
          myBooks: [newBook, ...state.myBooks],
        }))

        // Update user's books shared count
        set((state) => ({
          user: state.user ? { ...state.user, booksShared: state.user.booksShared + 1 } : null,
        }))
      },

      updateBook: (id, updates) => {
        set((state) => ({
          books: state.books.map((book) => (book.id === id ? { ...book, ...updates } : book)),
          myBooks: state.myBooks.map((book) => (book.id === id ? { ...book, ...updates } : book)),
        }))
      },

      deleteBook: (id) => {
        set((state) => ({
          books: state.books.filter((book) => book.id !== id),
          myBooks: state.myBooks.filter((book) => book.id !== id),
        }))

        // Update user's books shared count
        set((state) => ({
          user: state.user ? { ...state.user, booksShared: Math.max(0, state.user.booksShared - 1) } : null,
        }))
      },

      likeBook: (bookId) => {
        set((state) => ({
          books: state.books.map((book) => (book.id === bookId ? { ...book, likes: book.likes + 1 } : book)),
        }))
      },

      sendRequest: (bookId, message) => {
        const { user, books } = get()
        if (!user) return

        const book = books.find((b) => b.id === bookId)
        if (!book) return

        const newRequest: BookRequest = {
          id: Date.now().toString(),
          bookId,
          book,
          requesterId: user.id,
          requester: user,
          ownerId: book.owner.id,
          owner: book.owner,
          message,
          status: "pending",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set((state) => ({
          sentRequests: [newRequest, ...state.sentRequests],
          books: state.books.map((b) => (b.id === bookId ? { ...b, requests: b.requests + 1 } : b)),
        }))
      },

      respondToRequest: (requestId, status) => {
        set((state) => ({
          receivedRequests: state.receivedRequests.map((request) =>
            request.id === requestId ? { ...request, status, updatedAt: new Date().toISOString() } : request,
          ),
        }))

        // If accepted, create a chat
        if (status === "accepted") {
          const request = get().receivedRequests.find((r) => r.id === requestId)
          if (request) {
            const newChat: Chat = {
              id: Date.now().toString(),
              participants: [request.requester, request.owner],
              bookId: request.bookId,
              book: request.book,
              messages: [
                {
                  id: Date.now().toString(),
                  chatId: Date.now().toString(),
                  senderId: "system",
                  sender: {
                    id: "system",
                    name: "System",
                    email: "",
                    avatar: "",
                    location: "",
                    rating: 0,
                    booksShared: 0,
                    booksReceived: 0,
                    joinedAt: "",
                  },
                  content: `Book request accepted! You can now coordinate the exchange of "${request.book.title}".`,
                  type: "system",
                  createdAt: new Date().toISOString(),
                },
              ],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }

            set((state) => ({
              chats: [newChat, ...state.chats],
            }))
          }
        }
      },

      addChat: (chatData) => {
        const newChat: Chat = {
          ...chatData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set((state) => ({
          chats: [newChat, ...state.chats],
        }))
      },

      sendMessage: (chatId, content) => {
        const { user } = get()
        if (!user) return

        const newMessage: Message = {
          id: Date.now().toString(),
          chatId,
          senderId: user.id,
          sender: user,
          content,
          type: "text",
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [...chat.messages, newMessage],
                  lastMessage: newMessage,
                  updatedAt: new Date().toISOString(),
                }
              : chat,
          ),
        }))
      },

      setNotifications: (count) => set({ notifications: count }),
    }),
    {
      name: "bookcircle-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        myBooks: state.myBooks,
        sentRequests: state.sentRequests,
        receivedRequests: state.receivedRequests,
        chats: state.chats,
      }),
    },
  ),
)
