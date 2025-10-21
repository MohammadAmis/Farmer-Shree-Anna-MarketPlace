import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, CheckCircle2, MessageSquare } from "lucide-react";

const Orders = () => {
  const orders = [
    {
      id: "ORD212",
      buyer: "Maharashtra FPO",
      quantity: "500 kg",
      price: "₹22,500",
      status: "delivered",
      payment: "Paid",
      date: "18 Oct 2024",
    },
    {
      id: "ORD213",
      buyer: "Grain Traders Co.",
      quantity: "750 kg",
      price: "₹28,500",
      status: "in-transit",
      payment: "Escrow",
      date: "20 Oct 2024",
    },
    {
      id: "ORD214",
      buyer: "Organic Foods Ltd",
      quantity: "300 kg",
      price: "₹15,600",
      status: "pending",
      payment: "Pending",
      date: "21 Oct 2024",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-success">Delivered</Badge>;
      case "in-transit":
        return <Badge className="bg-accent">In Transit</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return null;
    }
  };

  const getPaymentBadge = (payment: string) => {
    switch (payment) {
      case "Paid":
        return <Badge className="bg-success">Paid</Badge>;
      case "Escrow":
        return <Badge className="bg-warning text-warning-foreground">Escrow</Badge>;
      case "Pending":
        return <Badge variant="outline">Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Orders & Payments</h1>
          <p className="text-muted-foreground">Track your sales and payment status</p>
        </div>

        {/* Payment Tracker Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 gradient-card shadow-custom-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Total Earned</span>
            </div>
            <p className="text-2xl font-bold text-foreground">₹66,600</p>
          </Card>

          <Card className="p-6 gradient-card shadow-custom-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <span className="text-sm text-muted-foreground">In Escrow</span>
            </div>
            <p className="text-2xl font-bold text-foreground">₹28,500</p>
          </Card>

          <Card className="p-6 gradient-card shadow-custom-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <span className="text-sm text-muted-foreground">Pending</span>
            </div>
            <p className="text-2xl font-bold text-foreground">₹15,600</p>
          </Card>
        </div>

        {/* Orders Table */}
        <Card className="p-6 shadow-custom-md overflow-x-auto">
          <h2 className="text-xl font-semibold text-foreground mb-6">Order History</h2>
          
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-muted/20 rounded-lg gap-4"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-foreground">{order.buyer}</p>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">Order #{order.id} • {order.date}</p>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground">Quantity</p>
                    <p className="font-medium text-foreground">{order.quantity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="font-semibold text-foreground">{order.price}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Payment</p>
                    {getPaymentBadge(order.payment)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <MessageSquare className="w-4 h-4" />
                    Contact
                  </Button>
                  {order.payment === "Escrow" && (
                    <Button size="sm" variant="ghost" className="text-accent">
                      View Details
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 mt-6 bg-primary/5 border-primary/20">
          <h3 className="font-semibold text-foreground mb-2">Secure Payment System</h3>
          <p className="text-sm text-muted-foreground">
            All payments are held in escrow until delivery is confirmed. Your earnings are safe and guaranteed.
          </p>
        </Card>
      </main>
    </div>
  );
};

export default Orders;
