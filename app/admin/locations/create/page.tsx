'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import axios from 'axios'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { MapPinIcon, DollarSignIcon, ClockIcon, StarIcon, ImageIcon, LandmarkIcon, MapIcon, PlusIcon, XIcon, HotelIcon, UtensilsIcon } from "lucide-react"
import { useToast } from '@/hooks/use-toast'

interface HotelDocument {
    _id: string;
    name: string;
}

interface RestaurantDocument {
    _id: string;
    name: string;
}

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
    location: z.string().min(5, {
        message: "Location must be at least 5 characters.",
    }),
    price: z.string().min(1, {
        message: "Price is required.",
    }),
    bestTime: z.string().min(2, {
        message: "Best time must be at least 2 characters.",
    }),
    hours: z.string().min(2, {
        message: "Hours must be at least 2 characters.",
    }),
    images: z.array(z.instanceof(File)).min(1, {
        message: "At least one image is required.",
    }),
    attractions: z.array(z.string()).min(1, {
        message: "At least one attraction is required.",
    }),
    nearbyPlaces: z.array(z.string()).min(1, {
        message: "At least one nearby place is required.",
    }),
    hotels: z.array(z.string()).min(1, {
        message: "At least one hotel must be selected.",
    }),
    restaurants: z.array(z.string()).min(1, {
        message: "At least one restaurant must be selected.",
    }),
})

type FormValues = z.infer<typeof formSchema>

export default function CreateLocationForm() {
    const router = useRouter()
    const [uploading, setUploading] = useState(false)
    const [hotels, setHotels] = useState<HotelDocument[]>([])
    const [restaurants, setRestaurants] = useState<RestaurantDocument[]>([])
    const { toast } = useToast()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            location: "",
            price: "",
            bestTime: "",
            hours: "",
            images: [],
            attractions: [""],
            nearbyPlaces: [""],
            hotels: [],
            restaurants: [],
        },
    })

    const { fields: attractionFields, append: appendAttraction, remove: removeAttraction } = useFieldArray({
        control: form.control,
        name: "attractions",
    })

    const { fields: nearbyPlaceFields, append: appendNearbyPlace, remove: removeNearbyPlace } = useFieldArray({
        control: form.control,
        name: "nearbyPlaces",
    })

    useEffect(() => {
        const fetchHotelsAndRestaurants = async () => {
            try {
                const hotelsResponse = await axios.get('/api/hotel')
                setHotels(hotelsResponse.data)

                const restaurantsResponse = await axios.get('/api/restaurant')
                setRestaurants(restaurantsResponse.data)
            } catch (error) {
                console.error('Error fetching hotels and restaurants:', error)
                toast({
                    title: 'Error',
                    description: 'Failed to load hotels and restaurants.',
                })
            }
        }

        fetchHotelsAndRestaurants()
    }, [toast])

    async function onSubmit(values: FormValues) {
        setUploading(true)
        const uploadedImages = await Promise.all(
            values.images.map(async (file) => {
                const formData = new FormData()
                formData.append('file', file)
                try {
                    const response = await axios.post('/api/upload', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    return response.data.imgUrl
                } catch (error) {
                    console.error('Error uploading image:', error)
                    return null
                }
            })
        )
        setUploading(false)

        const formDataWithImageUrls = {
            ...values,
            imageUrl: uploadedImages.filter(Boolean)
        }

        try {
            await axios.post('/api/location', formDataWithImageUrls)
            router.push('/admin/locations')
            toast({
                title: 'Location Created',
                description: 'Your new location has been successfully created.',
            })
            form.reset();
        } catch (error) {
            console.error(error)
            toast({
                title: 'Error',
                description: 'An error occurred while creating the location.',
            })
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 py-12">
            <div className="container mx-auto px-4 md:px-6">
                <Card className="w-full max-w-4xl mx-auto shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                        <CardTitle className="text-3xl font-bold text-center">Create New Location</CardTitle>
                    </CardHeader>
                    <CardContent className="mt-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-lg font-semibold">Location Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Central Park" {...field} className="text-lg" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-lg font-semibold flex items-center">
                                                    <MapPinIcon className="w-5 h-5 mr-2 text-blue-500" />
                                                    Address
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Full address" {...field} className="text-lg" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-semibold">Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Provide a detailed description of the location" {...field} className="text-lg" rows={5} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-lg font-semibold flex items-center">
                                                    <DollarSignIcon className="w-5 h-5 mr-2 text-green-500" />
                                                    Price
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. $10 per person" {...field} className="text-lg" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="bestTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-lg font-semibold flex items-center">
                                                    <ClockIcon className="w-5 h-5 mr-2 text-orange-500" />
                                                    Best Time to Visit
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Spring, 9-11 AM" {...field} className="text-lg" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="hours"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-lg font-semibold flex items-center">
                                                    <ClockIcon className="w-5 h-5 mr-2 text-purple-500" />
                                                    Operating Hours
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. 9 AM - 5 PM" {...field} className="text-lg" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Separator />
                                <div className="space-y-6">
                                    <div>
                                        <FormLabel className="text-xl font-semibold flex items-center mb-2">
                                            <LandmarkIcon className="w-6 h-6 mr-2 text-red-500" />
                                            Attractions
                                        </FormLabel>
                                        {attractionFields.map((field, index) => (
                                            <FormField
                                                key={field.id}
                                                control={form.control}
                                                name={`attractions.${index}`}
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center mb-2">
                                                        <FormControl>
                                                            <Input {...field} className="text-lg flex-grow" placeholder={`Attraction ${index + 1}`} />
                                                        </FormControl>
                                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeAttraction(index)} className="ml-2">
                                                            <XIcon className="h-4 w-4" />
                                                        </Button>
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                        <Button type="button" variant="outline" size="sm" onClick={() => appendAttraction("")} className="mt-2">
                                            <PlusIcon className="h-4 w-4 mr-2" /> Add Attraction
                                        </Button>
                                        <FormMessage>{form.formState.errors.attractions?.message}</FormMessage>
                                    </div>
                                    <div>
                                        <FormLabel className="text-xl font-semibold flex items-center mb-2">
                                            <MapIcon className="w-6 h-6 mr-2 text-green-500" />
                                            Nearby Places
                                        </FormLabel>
                                        {nearbyPlaceFields.map((field, index) => (
                                            <FormField
                                                key={field.id}
                                                control={form.control}
                                                name={`nearbyPlaces.${index}`}
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center mb-2">
                                                        <FormControl>
                                                            <Input {...field} className="text-lg flex-grow" placeholder={`Nearby Place ${index + 1}`} />
                                                        </FormControl>
                                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeNearbyPlace(index)} className="ml-2">
                                                            <XIcon className="h-4 w-4" />
                                                        </Button>
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                        <Button type="button" variant="outline" size="sm" onClick={() => appendNearbyPlace("")} className="mt-2">
                                            <PlusIcon className="h-4 w-4 mr-2" /> Add Nearby Place
                                        </Button>
                                        <FormMessage>{form.formState.errors.nearbyPlaces?.message}</FormMessage>
                                    </div>
                                </div>
                                <Separator />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="hotels"

                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xl font-semibold flex items-center">
                                                    <HotelIcon className="w-6 h-6 mr-2 text-blue-500" />
                                                    Hotels
                                                </FormLabel>
                                                <ScrollArea className="h-[200px] w-full border rounded-md p-4">
                                                    <div className="space-y-2">
                                                        {hotels.map((hotel) => (
                                                            <div key={hotel._id} className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id={`hotel-${hotel._id}`}
                                                                    checked={field.value.includes(hotel._id)}
                                                                    onCheckedChange={(checked) => {
                                                                        if (checked) {
                                                                            field.onChange([...field.value, hotel._id])
                                                                        } else {
                                                                            field.onChange(field.value.filter((id) => id !== hotel._id))
                                                                        }
                                                                    }}
                                                                />
                                                                <label htmlFor={`hotel-${hotel._id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                    {hotel.name}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </ScrollArea>
                                                <FormDescription>Select one or more hotels</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="restaurants"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xl font-semibold flex items-center">
                                                    <UtensilsIcon className="w-6 h-6 mr-2 text-red-500" />
                                                    Restaurants
                                                </FormLabel>
                                                <ScrollArea className="h-[200px] w-full border rounded-md p-4">
                                                    <div className="space-y-2">
                                                        {restaurants.map((restaurant) => (
                                                            <div key={restaurant._id} className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id={`restaurant-${restaurant._id}`}
                                                                    checked={field.value.includes(restaurant._id)}
                                                                    onCheckedChange={(checked) => {
                                                                        if (checked) {
                                                                            field.onChange([...field.value, restaurant._id])
                                                                        } else {
                                                                            field.onChange(field.value.filter((id) => id !== restaurant._id))
                                                                        }
                                                                    }}
                                                                />
                                                                <label htmlFor={`restaurant-${restaurant._id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                    {restaurant.name}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </ScrollArea>
                                                <FormDescription>Select one or more restaurants</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Separator />
                                <FormField
                                    control={form.control}
                                    name="images"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xl font-semibold flex items-center">
                                                <ImageIcon className="w-6 h-6 mr-2 text-blue-500" />
                                                Images
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={(e) => {
                                                        const files = Array.from(e.target.files || [])
                                                        field.onChange(files)
                                                    }}
                                                    className="text-lg"
                                                />
                                            </FormControl>
                                            <FormDescription>Select one or more images</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700 text-lg py-6" disabled={uploading}>
                                    {uploading ? 'Uploading...' : 'Create Location'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}