'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function RequestsSection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Parking Requests</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <Input placeholder="Search requests..." className="max-w-sm" />
                        <Button>Search</Button>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left p-2">User</th>
                                <th className="text-left p-2">Location</th>
                                <th className="text-left p-2">Date</th>
                                <th className="text-left p-2">Status</th>
                                <th className="text-left p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-2">John Doe</td>
                                <td className="p-2">Central Park</td>
                                <td className="p-2">2023-06-15</td>
                                <td className="p-2">Pending</td>
                                <td className="p-2">
                                    <Button variant="outline" size="sm">Approve</Button>
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2">Jane Smith</td>
                                <td className="p-2">Downtown Lot</td>
                                <td className="p-2">2023-06-16</td>
                                <td className="p-2">Approved</td>
                                <td className="p-2">
                                    <Button variant="outline" size="sm">Cancel</Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
