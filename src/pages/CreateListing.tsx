import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreateListing = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [requestQA, setRequestQA] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Listing created successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Listing</h1>
          <p className="text-muted-foreground">List your produce to connect with buyers</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-smooth ${
                  step >= num
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > num ? <CheckCircle2 className="w-6 h-6" /> : num}
              </div>
              {num < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-smooth ${
                    step > num ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="p-6 md:p-8 shadow-custom-md mb-6">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Crop Details</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="milletType">Millet Type</Label>
                  <Select>
                    <SelectTrigger id="milletType">
                      <SelectValue placeholder="Select millet type" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="finger">Finger Millet (Ragi)</SelectItem>
                      <SelectItem value="pearl">Pearl Millet (Bajra)</SelectItem>
                      <SelectItem value="foxtail">Foxtail Millet</SelectItem>
                      <SelectItem value="little">Little Millet</SelectItem>
                      <SelectItem value="kodo">Kodo Millet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="variety">Variety</Label>
                  <Input id="variety" placeholder="e.g., ML-365" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Quantity & Pricing</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (kg)</Label>
                  <Input id="quantity" type="number" placeholder="e.g., 500" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Expected Price (₹/kg)</Label>
                  <Input id="price" type="number" placeholder="e.g., 45" />
                  <p className="text-xs text-muted-foreground">Current market rate: ₹42-48/kg</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Upload Images</h2>
                
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-base cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Quality Assurance</h2>
                
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Request QA Testing</p>
                    <p className="text-sm text-muted-foreground">Get quality certification for better pricing</p>
                  </div>
                  <Switch checked={requestQA} onCheckedChange={setRequestQA} />
                </div>

                {requestQA && (
                  <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                    <p className="text-sm text-foreground">
                      Your produce will be tested at the nearest QA center. Results typically available in 2-3 days.
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>

          <div className="flex justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Previous
            </Button>
            
            {step < 4 ? (
              <Button
                type="button"
                onClick={() => setStep(step + 1)}
                className="bg-primary hover:bg-primary-hover"
              >
                Next
              </Button>
            ) : (
              <Button type="submit" className="bg-success hover:bg-success/90">
                ✅ Post My Lot
              </Button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateListing;
