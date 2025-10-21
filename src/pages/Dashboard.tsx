import { Navigation } from "@/components/Navigation";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, TestTube, DollarSign, TrendingUp, Plus, Package, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const recentListings = [
    { id: "MLT001", crop: "Finger Millet", quantity: "500 kg", price: "₹45/kg", status: "Active" },
    { id: "MLT002", crop: "Pearl Millet", quantity: "750 kg", price: "₹38/kg", status: "Active" },
    { id: "MLT003", crop: "Foxtail Millet", quantity: "300 kg", price: "₹52/kg", status: "Sold" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Farmer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your farm overview</p>
          </div>
          <Link to="/create-listing">
            <Button className="bg-primary hover:bg-primary-hover gap-2">
              <Plus className="w-5 h-5" />
              Create New Listing
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={ShoppingBag}
            title="Active Listings"
            value="3"
            color="primary"
          />
          <StatCard
            icon={TestTube}
            title="QA Reports Ready"
            value="2"
            trend="+1 today"
            color="accent"
          />
          <StatCard
            icon={DollarSign}
            title="Pending Payments"
            value="₹12,500"
            color="secondary"
          />
          <StatCard
            icon={TrendingUp}
            title="This Month Earnings"
            value="₹32,400"
            trend="+18%"
            color="success"
          />
        </div>

        {/* Recent Listings */}
        <Card className="p-6 mb-8 shadow-custom-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Recent Listings</h2>
            <Link to="/create-listing">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentListings.map((listing) => (
              <div
                key={listing.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/30 rounded-lg gap-3"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{listing.crop}</p>
                    <p className="text-sm text-muted-foreground">Lot ID: {listing.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-8">
                  <div className="text-sm">
                    <p className="text-muted-foreground">Quantity</p>
                    <p className="font-medium text-foreground">{listing.quantity}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">Price</p>
                    <p className="font-medium text-foreground">{listing.price}</p>
                  </div>
                  <Badge
                    variant={listing.status === "Active" ? "default" : "secondary"}
                    className={listing.status === "Active" ? "bg-success" : ""}
                  >
                    {listing.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        
      </main>
    </div>
  );
};

export default Dashboard;
