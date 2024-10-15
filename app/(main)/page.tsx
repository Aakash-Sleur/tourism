"use client"

import { useState, useEffect } from 'react'
import Link from "next/link"
import { motion, useAnimation } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPinIcon, ClockIcon, PlaneIcon, CameraIcon, UtensilsIcon, BedIcon, StarIcon, PhoneIcon, SunIcon, CloudIcon, LeafIcon } from "lucide-react"
import { useSession } from 'next-auth/react'

const FloatingElement = ({ children, x, y, duration }: {
  children: React.ReactNode
  x: number
  y: number
  duration: number
}) => (
  <motion.div
    className="absolute"
    animate={{
      x: [0, x, 0],
      y: [0, y, 0],
    }}
    transition={{
      repeat: Infinity,
      duration: duration,
      ease: "easeInOut",
    }}
  >
    {children}
  </motion.div>
)

export default function EnhancedTourismHomePage() {
  const [searchDestination, setSearchDestination] = useState("");
  const controls = useAnimation()
  const session = useSession()

  console.log(session)

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    })
  }, [controls])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", searchDestination)
  }

  return (
    <>
      <main className="flex-1 bg-gradient-to-b from-blue-100 to-green-100">
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-blue-900 bg-opacity-60"></div>
          <FloatingElement x={20} y={10} duration={4}>
            <SunIcon className="text-yellow-300 w-12 h-12" />
          </FloatingElement>
          <FloatingElement x={-15} y={25} duration={5}>
            <CloudIcon className="text-white w-16 h-16 opacity-60" />
          </FloatingElement>
          <FloatingElement x={30} y={-20} duration={6}>
            <LeafIcon className="text-green-400 w-8 h-8" />
          </FloatingElement>
          <div className="container relative px-4 md:px-6 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              className="flex flex-col items-center space-y-4 text-center"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Discover the World with WanderLust
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  Explore breathtaking destinations, immerse in local cultures, and create unforgettable memories.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form onSubmit={handleSearch} className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1 bg-white text-black"
                    placeholder="Where do you want to go?"
                    type="text"
                    value={searchDestination}
                    onChange={(e) => setSearchDestination(e.target.value)}
                  />
                  <Button type="submit" className="bg-yellow-500 text-blue-900 hover:bg-yellow-600">Explore</Button>
                </form>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-blue-900">How It Works</h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              {[
                { icon: MapPinIcon, title: "Choose Your Destination", description: "Browse through our curated list of destinations or search for your dream location." },
                { icon: ClockIcon, title: "Plan Your Trip", description: "Customize your itinerary with our easy-to-use trip planner. Add activities, accommodations, and more." },
                { icon: PlaneIcon, title: "Embark on Your Journey", description: "Set off on your adventure with confidence, knowing every detail has been taken care of." }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={controls}
                  transition={{ delay: index * 0.2 }}
                  className="flex flex-col items-center space-y-4 text-center"
                >
                  <div className="rounded-full bg-blue-100 p-3">
                    <item.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="destinations" className="w-full py-12 md:py-24 lg:py-32 bg-blue-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-blue-900">Popular Destinations</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: 'Paris', image: '/placeholder.svg?height=400&width=600' },
                { name: 'Tokyo', image: '/placeholder.svg?height=400&width=600' },
                { name: 'New York', image: '/placeholder.svg?height=400&width=600' },
                { name: 'Bali', image: '/placeholder.svg?height=400&width=600' },
                { name: 'Rome', image: '/placeholder.svg?height=400&width=600' },
                { name: 'Santorini', image: '/placeholder.svg?height=400&width=600' }
              ].map((destination, index) => (
                <motion.div
                  key={destination.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={controls}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="group"
                >
                  <Card className="overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <img src={destination.image} alt={destination.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                      <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">{destination.name}</h3>
                    </div>
                    <CardContent>
                      <p className="text-sm text-gray-600 mt-2">Explore the wonders of {destination.name}</p>
                      <Button className="mt-4 bg-blue-600 text-white hover:bg-blue-700">View Details</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="experiences" className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-blue-900">Unforgettable Experiences</h2>
            <Tabs defaultValue="cultural" className="w-full max-w-3xl mx-auto">
              <TabsList className="grid w-full grid-cols-3 bg-blue-100">
                <TabsTrigger value="cultural" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Cultural</TabsTrigger>
                <TabsTrigger value="adventure" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Adventure</TabsTrigger>
                <TabsTrigger value="relaxation" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Relaxation</TabsTrigger>
              </TabsList>
              <TabsContent value="cultural">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-900">Cultural Experiences</CardTitle>
                    <CardDescription>Immerse yourself in local traditions and history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="mt-2 space-y-1">
                      <li className="flex items-center"><CameraIcon className="h-4 w-4 mr-2 text-blue-600" /> Guided museum tours</li>
                      <li className="flex items-center"><UtensilsIcon className="h-4 w-4 mr-2 text-blue-600" /> Cooking classes with local chefs</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="adventure">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-900">Adventure Experiences</CardTitle>
                    <CardDescription>Get your adrenaline pumping</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="mt-2 space-y-1">
                      <li className="flex items-center"><MapPinIcon className="h-4 w-4 mr-2 text-blue-600" /> Hiking expeditions</li>
                      <li className="flex items-center"><PlaneIcon className="h-4 w-4 mr-2 text-blue-600" /> Skydiving adventures</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="relaxation">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-900">Relaxation Experiences</CardTitle>
                    <CardDescription>Unwind and rejuvenate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="mt-2 space-y-1">
                      <li className="flex items-center"><BedIcon className="h-4 w-4 mr-2 text-blue-600" /> Luxury spa retreats</li>
                      <li className="flex items-center"><UtensilsIcon className="h-4 w-4 mr-2 text-blue-600" /> Beachside yoga sessions</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Choose WanderLust?</h2>
                <p className="max-w-[900px] text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of happy travelers who have experienced the world with WanderLust.
                </p>
              </div>
              <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
                {[
                  { icon: StarIcon, title: "5-Star Experiences", description: "Consistently rated 5 stars by our travelers" },
                  { icon: MapPinIcon, title: "Expert Local Guides", description: "Knowledgeable guides to enhance your journey" },
                  { icon: PhoneIcon, title: "24/7 Support", description: "Always here to assist you, wherever you are" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={controls}
                    transition={{ delay: index * 0.2 }}
                    className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-blue-700"
                  >
                    <item.icon className="h-10 w-10 text-yellow-400" />
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-sm text-blue-100">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-green-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-blue-900">Start Your Journey</h2>
                <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Ready to explore? Get in touch with our travel experts.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex flex-col gap-2">
                  <Input placeholder="Your Name" type="text" className="bg-white" />
                  <Input placeholder="Your Email" type="email" className="bg-white" />
                  <Input placeholder="Your Dream Destination" type="text" className="bg-white" />
                  <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Plan My Trip</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-blue-900 text-white">
        <p className="text-xs text-blue-300">© 2024 WanderLust. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-blue-300" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-blue-300" href="#">
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </>
  )
}