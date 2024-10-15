"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchIcon, MapPinIcon, CalendarIcon, DollarSignIcon, StarIcon, ClockIcon, LandmarkIcon, MapIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"

interface LocationDocument {
    _id: string;
    name: string;
    description: string;
    location: string;
    price: string;
    bestTime: string;
    hours: string;
    rating: number;
    imageUrl: string[];
    attractions: string[];
    nearbyPlaces: string[];
    createdAt: string;
    updatedAt: string;
}

export default function ExploreDestinations() {
    const [searchTerm, setSearchTerm] = useState("")
    const [tourismDestinations, setTourismDestinations] = useState<LocationDocument[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await axios.get("/api/location")
                console.log("API Response:", response.data) // Debug log
                setTourismDestinations(response.data)
            } catch (err) {
                console.error("Error fetching data:", err) // Debug log
                setError("Failed to load destinations. Please try again later.")
            } finally {
                setLoading(false)
            }
        }

        fetchDestinations()
    }, [])

    const filteredDestinations = tourismDestinations.filter(place =>
        place.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Search term:", searchTerm) // Debug log
    }

    console.log("Filtered Destinations:", filteredDestinations) // Debug log

    if (loading) {
        return <div className="text-center text-blue-600 text-xl font-semibold">Loading amazing destinations...</div>
    }

    if (error) {
        return <div className="text-center text-red-600 text-xl font-semibold">{error}</div>
    }

    return (
        <main className="flex-1 bg-gradient-to-b from-blue-100 to-green-100 min-h-screen">
            <section className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden">
                <div className="container px-4 md:px-6">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none mb-8 text-blue-900 text-center">
                        Explore Dream Destinations
                    </h1>
                    <form
                        className="flex w-full max-w-sm mx-auto items-center space-x-2 mb-12"
                        onSubmit={handleSearch}
                    >
                        <Input
                            className="flex-1"
                            placeholder="Search for destinations"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                            <SearchIcon className="h-4 w-4" />
                            <span className="sr-only">Search</span>
                        </Button>
                    </form>
                    {filteredDestinations.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredDestinations.map((place, index) => (
                                <div
                                    key={place._id}
                                    className="transition-all duration-300 ease-in-out transform hover:scale-105"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <Card className="overflow-hidden shadow-lg animate-fade-in">
                                        <CardHeader className="p-0">
                                            <div className="relative h-48">
                                                <img
                                                    src={place.imageUrl[0] || `/placeholder.svg?height=200&width=400&text=${place.name}`}
                                                    alt={place.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                                                <CardTitle className="absolute bottom-4 left-4 text-white text-xl font-bold">{place.name}</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                                                <MapPinIcon className="h-4 w-4 text-blue-500" />
                                                <span>{place.location}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                                                <ClockIcon className="h-4 w-4 text-purple-500" />
                                                <span>Hours: {place.hours}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                                                <DollarSignIcon className="h-4 w-4 text-yellow-500" />
                                                <span>Price: ${place.price}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                                                <StarIcon className="h-4 w-4 text-orange-500" />
                                                <span>Rating: {place.rating} / 5</span>
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button
                                                className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
                                                onClick={() => router.push(`/location/${place._id}`)}
                                            >
                                                Explore Now
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-600 text-xl">
                            No destinations found. Try a different search term.
                        </p>
                    )}
                </div>
            </section>
        </main>
    )
}