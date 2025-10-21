import { Navigation } from "@/components/Navigation";
import { FeatureCard } from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sprout, TestTube, TrendingUp, Package, ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-millet-field.jpg";
import farmerImage from "@/assets/farmer-with-millet.jpg";

const Index = () => {
  const recentListings = [
    {
      id: "MLT101",
      farmer: "Ramesh Kumar",
      crop: "Finger Millet (Ragi)",
      quantity: "500 kg",
      price: "₹45/kg",
      location: "Karnataka",
      certified: true,
    },
    {
      id: "MLT102",
      farmer: "Suresh Patil",
      crop: "Pearl Millet (Bajra)",
      quantity: "750 kg",
      price: "₹38/kg",
      location: "Maharashtra",
      certified: false,
    },
    {
      id: "MLT103",
      farmer: "Lakshmi Devi",
      crop: "Foxtail Millet",
      quantity: "300 kg",
      price: "₹52/kg",
      location: "Tamil Nadu",
      certified: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-secondary text-secondary-foreground">
              Empowering Farmers. Connecting Markets.
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Digital Marketplace for Millet Farmers
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
              Fair pricing, quality certification, and direct market linkages for India's millet producers
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/create-listing">
                <Button size="lg" className="bg-primary hover:bg-primary-hover w-full sm:w-auto">
                  <Sprout className="w-5 h-5" />
                  Sell Your Produce
                </Button>
              </Link>
              <Link to="/qa-request">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 w-full sm:w-auto backdrop-blur-sm"
                >
                  <TestTube className="w-5 h-5" />
                  Request QA Test
                </Button>
              </Link>
              <Link to="/market-prices">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 w-full sm:w-auto backdrop-blur-sm"
                >
                  <TrendingUp className="w-5 h-5" />
                  View Market Prices
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Shree Anna Marketplace?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A trusted platform designed specifically for millet farmers and buyers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={TrendingUp}
              title="Fair Pricing & Transparency"
              description="Get the best market rates with real-time price updates and transparent bidding. No middlemen, direct connections."
            />
            <FeatureCard
              icon={TestTube}
              title="Quality Certification Support"
              description="Access to certified testing labs and quality assurance services. Earn premium prices with proper certification."
            />
            <FeatureCard
              icon={Package}
              title="Direct Market Linkages"
              description="Connect directly with FPOs, buyers, and traders. Secure payments and reliable logistics support."
            />
          </div>
        </div>
      </section>

      {/* Marketplace Preview */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Current Marketplace Listings
              </h2>
              <p className="text-muted-foreground">Fresh produce available from farmers across India</p>
            </div>
            <Link to="/dashboard">
              <Button variant="outline" className="gap-2 hidden md:flex">
                View All Listings
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden shadow-custom-md hover:shadow-custom-lg transition-smooth">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Sprout className="w-6 h-6 text-primary" />
                    </div>
                    {listing.certified && (
                      <Badge className="bg-success gap-1">
                        <TestTube className="w-3 h-3" />
                        Certified
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2">{listing.crop}</h3>
                  <p className="text-sm text-muted-foreground mb-4">By {listing.farmer}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-medium text-foreground">{listing.quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-semibold text-primary">{listing.price}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {listing.location}
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary-hover">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link to="/dashboard">
              <Button variant="outline" className="gap-2">
                View All Listings
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Knowledge Hub Banner */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden shadow-custom-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div
                className="bg-cover bg-center min-h-[300px]"
                style={{ backgroundImage: `url(${farmerImage})` }}
              />
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Learn & Grow with Our Knowledge Hub
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Access video tutorials, articles, and government schemes. Stay updated with the latest
                  farming techniques, market trends, and financial support programs.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">✓</span>
                    </div>
                    <span className="text-foreground">Video tutorials in regional languages</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">✓</span>
                    </div>
                    <span className="text-foreground">Expert articles and guides</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">✓</span>
                    </div>
                    <span className="text-foreground">Latest government schemes</span>
                  </div>
                </div>
                <Link to="/knowledge">
                  <Button className="bg-accent hover:bg-accent-hover gap-2">
                    Explore Knowledge Hub
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
                  <Sprout className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-lg text-foreground">Shree Anna</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering millet farmers with fair market access and quality support.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/dashboard" className="hover:text-primary transition-base">Dashboard</Link></li>
                <li><Link to="/create-listing" className="hover:text-primary transition-base">Create Listing</Link></li>
                <li><Link to="/qa-reports" className="hover:text-primary transition-base">QA Reports</Link></li>
                <li><Link to="/orders" className="hover:text-primary transition-base">Orders</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/knowledge" className="hover:text-primary transition-base">Knowledge Hub</Link></li>
                <li><Link to="/support" className="hover:text-primary transition-base">Support</Link></li>
                <li><a href="#" className="hover:text-primary transition-base">FAQs</a></li>
                <li><a href="#" className="hover:text-primary transition-base">Terms</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Toll-free: 1800-XXX-XXXX</li>
                <li>Email: support@shreeanna.in</li>
                <li>WhatsApp: +91-XXXXX-XXXXX</li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Shree Anna Millet Marketplace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
