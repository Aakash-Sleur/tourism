'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPinIcon, CalendarIcon, ClockIcon, DollarSignIcon, StarIcon } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { useToast } from '@/hooks/use-toast'
import { IUser } from '@/lib/types'
import TripBookingDialog from '@/components/custom/tripe-dialog'

interface Timing {
    start: string;
    end: string;
}

interface HotelDocument {
    _id: string;
    name: string;
    description: string;
    location: string;
    banner: string;
    timing: Timing;
}

interface RestaurantDocument {
    _id: string;
    name: string;
    description: string;
    location: string;
    banner: string;
    timing: Timing;
}

interface Review {
    _id: string;
    user: IUser;
    comment: string;
    rating: number;
    createdAt: string;
}

export interface LocationDocument {
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
    hotels: HotelDocument[];
    restaurants: RestaurantDocument[];
    reviews: Review[];
    createdAt: string;
    updatedAt: string;
}

export default function DestinationDetails() {
    const router = useRouter()
    const { id } = useParams();
    const [destination, setDestination] = useState<LocationDocument | null>(null);
    const [reviews, setReviews] = useState<Review[] | null>(null)
    const [isClient, setIsClient] = useState(false);
    const [newReview, setNewReview] = useState({ content: '', rating: 5 });
    const { data } = useSession();
    const { toast } = useToast()

    console.log(data)

    useEffect(() => {
        setIsClient(true);
        const fetchDestination = async () => {
            try {
                const response = await axios.get(`/api/location/${id}`);
                setDestination(response.data);
                const reviewResponse = await axios.get(`/api/location/${id}/review`)
                setReviews(reviewResponse.data)
            } catch (error) {
                console.error('Error fetching destination:', error);
            }
        }

        if (id) {
            fetchDestination();
        }
    }, [id])

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axios.post(`/api/location/${id}/review`, {
                userId: data?.user.id,
                comment: newReview.content,
                rating: newReview.rating
            })
            toast({
                title: "Review Submitted",
                description: "Your review has been submitted successfully."
            })
            setNewReview({ content: '', rating: 5 })
            router.refresh();
        } catch (error) {
            console.error('Error submitting review:', error);
            toast({
                title: "Error",
                description: "An error occurred while submitting your review. Please try again later."
            })
        }
    }

    const handleReviewDelete = async (reviewId: string) => {
        try {
            await axios.delete(`/api/location/${id}/review/${reviewId}`)
            toast({
                title: "Review Deleted",
                description: "The review has been deleted successfully."
            })
            router.refresh()
        } catch (error) {
            console.error('Error deleting review:', error);
            toast({
                title: "Error",
                description: "An error occurred while deleting your review. Please try again later."
            })
        }

        setNewReview({ content: '', rating: 5 })
    }

    if (!isClient || !destination) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <main className="bg-gray-100 min-h-screen">
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">{destination.name}</h1>
                    <p className="mt-1 text-sm text-gray-600">{destination.location}</p>
                </div>
            </header>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-3">
                            <Card>
                                <Carousel className="w-full">
                                    <CarouselContent>
                                        {destination.imageUrl.map((url, index) => (
                                            <CarouselItem key={index} className="w-full h-full">
                                                <div className="relative w-full h-full">
                                                    <img
                                                        src={url}
                                                        alt={`${destination.name} - Image ${index + 1}`}
                                                        className="rounded-lg object-cover"
                                                    />
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                                <CardContent className="mt-4">
                                    <p className="text-gray-700">{destination.description}</p>
                                </CardContent>
                            </Card>

                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Key Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <InfoItem icon={<CalendarIcon className="h-5 w-5 text-blue-500" />} label="Best Time to Visit" text={destination.bestTime} />
                                        <InfoItem icon={<ClockIcon className="h-5 w-5 text-blue-500" />} label="Operating Hours" text={destination.hours} />
                                        <InfoItem icon={<DollarSignIcon className="h-5 w-5 text-blue-500" />} label="Price" text={`$${destination.price}`} />
                                        <InfoItem icon={<StarIcon className="h-5 w-5 text-blue-500" />} label="Rating" text={destination.rating.toFixed(1)} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Attractions & Nearby Places</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="font-semibold mb-2">Attractions</h3>
                                            <ul className="list-disc list-inside">
                                                {destination.attractions.map((attraction, index) => (
                                                    <li key={index}>{attraction}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2">Nearby Places</h3>
                                            <ul className="list-disc list-inside">
                                                {destination.nearbyPlaces.map((place, index) => (
                                                    <li key={index}>{place}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <Card className='w-full md:col-span-2'>
                                <CardContent className="p-6">
                                    <TripBookingDialog id={destination._id} location={destination.name} price={parseInt(destination.price)} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Accommodations & Dining</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="hotels">
                                <TabsList className="grid w-full grid-cols-2 mb-4">
                                    <TabsTrigger value="hotels">Hotels</TabsTrigger>
                                    <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
                                </TabsList>
                                <TabsContent value="hotels">
                                    <Carousel className="w-full">
                                        <CarouselContent>
                                            {destination.hotels.map((hotel) => (
                                                <CarouselItem key={hotel._id} className="md:basis-1/2 lg:basis-1/3 p-2">
                                                    <HotelCard hotel={hotel} />
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <CarouselPrevious />
                                        <CarouselNext />
                                    </Carousel>
                                </TabsContent>
                                <TabsContent value="restaurants">
                                    <Carousel className="w-full">
                                        <CarouselContent>
                                            {destination.restaurants && destination.restaurants.map((restaurant) => (
                                                <CarouselItem key={restaurant._id} className="md:basis-1/2 lg:basis-1/3 p-2">
                                                    <RestaurantCard restaurant={restaurant} />
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <CarouselPrevious />
                                        <CarouselNext />
                                    </Carousel>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Reviews</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {
                                reviews &&
                                reviews.map((review) => (
                                    <div key={review._id} className="mb-4 p-4 bg-white rounded-lg shadow">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-semibold">{review.user.username}</h4>
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <StarIcon
                                                        key={i}
                                                        className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-600">{review.comment}</p>
                                    </div>
                                ))}

                            <form onSubmit={handleReviewSubmit} className="mt-6">
                                <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="content">Your Review</Label>
                                        <Textarea
                                            id="content"
                                            value={newReview.content}
                                            onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="rating">Rating</Label>
                                        <select
                                            id="rating"
                                            value={newReview.rating}
                                            onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                        >
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <option key={num} value={num}>
                                                    {num} Star{num !== 1 ? 's' : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <Button type="submit">Submit Review</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    )
}

function InfoItem({ icon, label, text }: { icon: React.ReactNode; label: string; text: string }) {
    return (
        <div className="flex items-center space-x-2">
            {icon}
            <span className="font-medium">{label}:</span>
            <span>{text}</span>
        </div>
    )
}

function HotelCard({ hotel }: { hotel: HotelDocument }) {
    return (
        <Card className="h-full flex flex-col">
            <div className="relative h-48">
                <Image
                    src={hotel.banner}
                    alt={hotel.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                />
            </div>
            <CardContent className="flex-grow p-4">
                <h3 className="font-bold text-lg mb-2">{hotel.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{hotel.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span>{hotel.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>{hotel.timing.start} - {hotel.timing.end}</span>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button className="w-full">Book Now</Button>
            </CardFooter>
        </Card>
    )
}

function RestaurantCard({ restaurant }: { restaurant: RestaurantDocument }) {
    return (
        <Card className="h-full flex flex-col">

            <div className="relative h-48">
                <Image
                    src={restaurant.banner}
                    alt={restaurant.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                />
            </div>
            <CardContent className="flex-grow p-4">
                <h3 className="font-bold text-lg mb-2">{restaurant.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{restaurant.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span>{restaurant.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>{restaurant.timing.start} - {restaurant.timing.end}</span>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button className="w-full">Reserve a Table</Button>
            </CardFooter>
        </Card>
    )
}