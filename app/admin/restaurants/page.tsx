'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface RestaurantDocument {
    _id: string;
    name: string;
    description: string;
    location: string;
    timing: {
        start: string;
        end: string;
    };
}

export default function RestaurantsSection() {
    const [restaurants, setRestaurants] = useState<RestaurantDocument[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get("/api/restaurant")
                console.log("API Response:", response.data) // Debug log
                setRestaurants(response.data)
            } catch (err) {
                console.error("Error fetching data:", err) // Debug log
                setError("Failed to load restaurants. Please try again later.")
            } finally {
                setLoading(false)
            }
        }

        fetchRestaurants()
    }, [])

    const filteredRestaurants = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.location.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        // The filtering is already done in real-time, so we don't need to do anything here
    }

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`/api/restaurant/${id}`)
            setRestaurants(restaurants.filter(restaurant => restaurant._id !== id))
        } catch (error) {
            console.error("Error deleting restaurant:", error)
            // You might want to show an error message to the user here
        }
    }

    if (loading) {
        return <div className="text-center py-12">Loading...</div>
    }

    if (error) {
        return <div className="text-center py-12 text-red-500">{error}</div>
    }

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Restaurants</CardTitle>
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => router.push('/admin/restaurants/create')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Restaurant
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <form onSubmit={handleSearch} className="flex items-center space-x-4">
                        <Input
                            placeholder="Search restaurants..."
                            className="max-w-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button type="submit">
                            <Search className="mr-2 h-4 w-4" />
                            Search
                        </Button>
                    </form>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Operating Hours</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRestaurants.map((restaurant) => (
                                <TableRow key={restaurant._id}>
                                    <TableCell>{restaurant.name}</TableCell>
                                    <TableCell>{restaurant.location}</TableCell>
                                    <TableCell>{`${restaurant.timing.start} - ${restaurant.timing.end}`}</TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => router.push(`/admin/restaurants/edit/${restaurant._id}`)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(restaurant._id)}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
