'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { LocationDocument } from '@/models/location.model'

export default function LocationsSection() {
    const [locations, setLocations] = useState<LocationDocument[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get("/api/location")
                console.log("API Response:", response.data) // Debug log
                setLocations(response.data)
            } catch (err) {
                console.error("Error fetching data:", err) // Debug log
                setError("Failed to load locations. Please try again later.")
            } finally {
                setLoading(false)
            }
        }

        fetchLocations()
    }, [])

    const filteredLocations = locations.filter(location =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.location.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        // The filtering is already done in real-time, so we don't need to do anything here
    }

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`/api/location/${id}`)
            setLocations(locations.filter(location => location._id !== id))
        } catch (error) {
            console.error("Error deleting location:", error)
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
                <CardTitle>Tourism Locations</CardTitle>
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => router.push('/admin/locations/create')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Location
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <form onSubmit={handleSearch} className="flex items-center space-x-4">
                        <Input
                            placeholder="Search locations..."
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
                                <TableHead>Best Time</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLocations.map((location, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{location.name}</TableCell>
                                    <TableCell>{location.location}</TableCell>
                                    <TableCell>{location.bestTime}</TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => router.push(`/admin/locations/edit/${location._id}`)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(location._id)}>
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