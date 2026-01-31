import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Admin Panel</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Welcome to the admin panel.</p>
                </CardContent>
            </Card>
        </div>
    );
}
