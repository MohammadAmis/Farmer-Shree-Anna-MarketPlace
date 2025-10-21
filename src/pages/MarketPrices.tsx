import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, MapPin, Calendar } from "lucide-react";

interface MarketPrice {
  id: string;
  crop_name: string;
  price_per_kg: number;
  location: string;
  market_date: string;
}

const MarketPrices = () => {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMarketPrices();
  }, []);

  const fetchMarketPrices = async () => {
    try {
      const { data, error } = await supabase
        .from("market_prices")
        .select("*")
        .order("market_date", { ascending: false })
        .order("crop_name", { ascending: true });

      if (error) throw error;

      setPrices(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch market prices",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const groupByLocation = (prices: MarketPrice[]) => {
    const grouped: { [key: string]: MarketPrice[] } = {};
    prices.forEach((price) => {
      if (!grouped[price.location]) {
        grouped[price.location] = [];
      }
      grouped[price.location].push(price);
    });
    return grouped;
  };

  const groupedPrices = groupByLocation(prices);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-primary" />
            Current Market Prices
          </h1>
          <p className="text-muted-foreground">
            Stay updated with the latest millet prices across different markets
          </p>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Loading market prices...
            </CardContent>
          </Card>
        ) : Object.keys(groupedPrices).length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No market prices available at the moment
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedPrices).map(([location, locationPrices]) => (
              <Card key={location}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    {location}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(locationPrices[0].market_date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Crop Name</TableHead>
                        <TableHead className="text-right">Price per Kg</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {locationPrices.map((price) => (
                        <TableRow key={price.id}>
                          <TableCell className="font-medium">{price.crop_name}</TableCell>
                          <TableCell className="text-right font-semibold">
                            ₹{price.price_per_kg.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="secondary">Current</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-8 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">💡 Pricing Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Prices may vary based on quality, certification, and organic status</p>
            <p>• Consider transport costs when pricing for distant markets</p>
            <p>• QA certified produce typically commands 15-20% premium</p>
            <p>• Check prices regularly as they fluctuate based on supply and demand</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MarketPrices;
