// src/pages/Settings.tsx
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  CreditCard,
  Globe,
  Bell,
  LogOut,
  Save,
  CheckCircle,
} from "lucide-react";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile */}
          <Card className="p-6">
            <div className="flex items-start gap-3 mb-6">
              <div className="mt-1 p-2 rounded-lg bg-primary/10">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Profile Information</h2>
                <p className="text-sm text-muted-foreground">Update your personal details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Ramesh" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Kumar" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="ramesh@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" placeholder="+91 XXXXX XXXXX" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Village, District, State" />
              </div>

              <Button className="gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </Card>

          {/* Bank */}
          <Card className="p-6">
            <div className="flex items-start gap-3 mb-6">
              <div className="mt-1 p-2 rounded-lg bg-accent/10">
                <CreditCard className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Bank Details</h2>
                <p className="text-sm text-muted-foreground">For payouts and transactions</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Holder Name</Label>
                <Input id="accountName" placeholder="As per bank records" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input id="accountNumber" type="text" placeholder="XXXX XXXX XXXX" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ifsc">IFSC Code</Label>
                  <Input id="ifsc" placeholder="SBIN0002499" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input id="bankName" placeholder="State Bank of India" />
                </div>
              </div>
              <Button className="gap-2">
                <Save className="w-4 h-4" />
                Update Bank Info
              </Button>
            </div>
          </Card>

          {/* Preferences */}
          <Card className="p-6">
            <div className="flex items-start gap-3 mb-6">
              <div className="mt-1 p-2 rounded-lg bg-secondary/20">
                <Globe className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Language & Region</h2>
                <p className="text-sm text-muted-foreground">Choose your preferred language</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Preferred Language</Label>
                <Select defaultValue="english">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">हिन्दी (Hindi)</SelectItem>
                    <SelectItem value="kannada">ಕನ್ನಡ (Kannada)</SelectItem>
                    <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                    <SelectItem value="telugu">తెలుగు (Telugu)</SelectItem>
                    <SelectItem value="marathi">मराठी (Marathi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="gap-2">
                <CheckCircle className="w-4 h-4" />
                Save Preferences
              </Button>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <div className="flex items-start gap-3 mb-6">
              <div className="mt-1 p-2 rounded-lg bg-success/10">
                <Bell className="w-5 h-5 text-success" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Notifications</h2>
                <p className="text-sm text-muted-foreground">Manage how you receive alerts</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { id: "email", label: "Email Notifications", desc: "Order updates, reports" },
                { id: "sms", label: "SMS Alerts", desc: "Critical alerts only" },
                { id: "prices", label: "Market Price Updates", desc: "Daily price digest" },
                { id: "reports", label: "QA Report Ready", desc: "When new reports are available" },
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-muted/30 transition-colors"
                >
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.id !== "prices"} />
                </div>
              ))}
            </div>
          </Card>

          
        </div>
      </main>
    </div>
  );
};

export default Settings;