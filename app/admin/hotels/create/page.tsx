'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { MapPinIcon, ClockIcon, ImageIcon } from "lucide-react"
import { useToast } from '@/hooks/use-toast'

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
    timing: z.object({
        start: z.string().min(1, {
            message: "Start time is required.",
        }),
        end: z.string().min(1, {
            message: "End time is required.",
        }),
    }),
    banner: z.instanceof(File).optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function CreateHotelForm() {
    const router = useRouter()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            location: "",
            timing: {
                start: "",
                end: "",
            },
            banner: undefined,
        },
    })

    async function onSubmit(values: FormValues) {
        setIsSubmitting(true)
        try {
            let bannerUrl = ''
            if (values.banner) {
                const formData = new FormData()
                formData.append('file', values.banner)
                const uploadResponse = await axios.post('/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                bannerUrl = uploadResponse.data.imgUrl
            }

            const hotelData = {
                ...values,
                banner: bannerUrl,
            }

            await axios.post('/api/hotel', hotelData)
            router.push('/admin/hotels')
            toast({
                title: 'Hotel Created',
                description: 'Your new hotel has been successfully created.',
            })
        } catch (error) {
            console.error(error)
            toast({
                title: 'Error',
                description: 'An error occurred while creating the hotel.',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 py-12">
            <div className="container mx-auto px-4 md:px-6">
                <Card className="w-full max-w-4xl mx-auto shadow-xl">
                    <CardHeader className="bg-blue-600 text-white">
                        <CardTitle className="text-3xl font-bold text-center">Create New Hotel</CardTitle>
                    </CardHeader>
                    <CardContent className="mt-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-semibold">Hotel Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Grand Hotel" {...field} className="text-lg" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-semibold">Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Provide a detailed description of the hotel" {...field} className="text-lg" rows={5} />
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
                                                Location
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Full address" {...field} className="text-lg" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="timing.start"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-lg font-semibold flex items-center">
                                                    <ClockIcon className="w-5 h-5 mr-2 text-green-500" />
                                                    Start Time
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="time" {...field} className="text-lg" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="timing.end"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-lg font-semibold flex items-center">
                                                    <ClockIcon className="w-5 h-5 mr-2 text-red-500" />
                                                    End Time
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="time" {...field} className="text-lg" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="banner"
                                    render={({ field: { value, onChange, ...field } }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-semibold flex items-center">
                                                <ImageIcon className="w-5 h-5 mr-2 text-blue-500" />
                                                Banner Image
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0]
                                                        if (file) {
                                                            onChange(file)
                                                        }
                                                    }}
                                                    {...field}
                                                    className="text-lg"
                                                />
                                            </FormControl>
                                            <FormDescription>Select a banner image for the hotel</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white hover:bg-blue-700 text-lg py-6"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Creating Hotel...' : 'Create Hotel'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}