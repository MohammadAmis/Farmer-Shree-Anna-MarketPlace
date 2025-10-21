// src/pages/QARequest.tsx
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { MapPin, Phone, Mail, Clock, Star, CheckCircle2, Truck, Calendar, Package, TestTube, FileText } from "lucide-react";

const qaRequestSchema = z.object({
  cropName: z.string().trim().min(1, "Crop name is required").max(100),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.string().min(1, "Unit is required"),
  testType: z.enum(["quality_check", "pesticide_residue", "moisture_content", "purity_test", "full_analysis"]),
  notes: z.string().max(500).optional(),
  selectedLabId: z.string().min(1, "Please select a QA lab"),
});

const QARequest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedLab, setSelectedLab] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    cropName: "",
    quantity: "",
    unit: "kg",
    testType: "",
    notes: ""
  });

  // Mock QA Labs data - in real app, this would come from your database
  const qaLabs = [
    {
      id: "1",
      name: "Karnataka Agricultural Testing Lab",
      location: "Bangalore, Karnataka",
      distance: "5 km",
      rating: 4.8,
      reviews: 124,
      phone: "+91-80-XXXX-XXXX",
      email: "katl@example.com",
      hours: "9:00 AM - 5:00 PM",
      specialties: ["Millet Testing", "Quality Certification", "Pesticide Analysis"],
      estimatedTime: "2-3 days",
      pickupAvailable: true,
      certification: "NABL Accredited"
    },
    {
      id: "2",
      name: "Maharashtra Quality Control Center",
      location: "Pune, Maharashtra",
      distance: "12 km",
      rating: 4.6,
      reviews: 89,
      phone: "+91-20-XXXX-XXXX",
      email: "mqcc@example.com",
      hours: "9:00 AM - 5:00 PM",
      specialties: ["Grain Quality", "Moisture Testing", "Full Analysis"],
      estimatedTime: "1-2 days",
      pickupAvailable: true,
      certification: "FSSAI Approved"
    },
    {
      id: "3",
      name: "Tamil Nadu Grain Testing Facility",
      location: "Chennai, Tamil Nadu",
      distance: "8 km",
      rating: 4.9,
      reviews: 156,
      phone: "+91-44-XXXX-XXXX",
      email: "tngtf@example.com",
      hours: "9:00 AM - 5:00 PM",
      specialties: ["Organic Certification", "Export Quality", "Purity Tests"],
      estimatedTime: "3-4 days",
      pickupAvailable: false,
      certification: "NABL Accredited"
    },
    {
      id: "4",
      name: "Rajasthan Millet Analysis Center",
      location: "Jaipur, Rajasthan",
      distance: "15 km",
      rating: 4.4,
      reviews: 67,
      phone: "+91-141-XXXX-XXXX",
      email: "rmac@example.com",
      hours: "9:00 AM - 5:00 PM",
      specialties: ["Millet Specific", "Traditional Varieties", "Quick Tests"],
      estimatedTime: "1 day",
      pickupAvailable: true,
      certification: "State Certified"
    },
    {
      id: "5",
      name: "Andhra Pradesh Agricultural Lab",
      location: "Hyderabad, Andhra Pradesh",
      distance: "20 km",
      rating: 4.7,
      reviews: 98,
      phone: "+91-40-XXXX-XXXX",
      email: "apal@example.com",
      hours: "9:00 AM - 5:00 PM",
      specialties: ["Comprehensive Analysis", "Digital Reports", "Fast Turnaround"],
      estimatedTime: "2 days",
      pickupAvailable: true,
      certification: "NABL Accredited"
    },
  ];

  const filteredLabs = qaLabs.filter(lab =>
    lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedLabData = qaLabs.find(lab => lab.id === selectedLab);

  // Get test type display name
  const getTestTypeDisplay = (testType: string) => {
    const testTypes = {
      quality_check: "Quality Check",
      pesticide_residue: "Pesticide Residue Test",
      moisture_content: "Moisture Content Test",
      purity_test: "Purity Test",
      full_analysis: "Full Analysis"
    };
    return testTypes[testType as keyof typeof testTypes] || testType;
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please login to request a QA test",
          variant: "destructive",
        });
        navigate("/auth");
      } else {
        setIsAuthenticated(true);
      }
    });
  }, [navigate, toast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = {
        cropName: formData.cropName,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        testType: formData.testType as any,
        notes: formData.notes,
        selectedLabId: selectedLab,
      };

      const validated = qaRequestSchema.parse(data);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase.from("qa_requests").insert({
        user_id: user.id,
        crop_name: validated.cropName,
        quantity: validated.quantity,
        unit: validated.unit,
        test_type: validated.testType,
        notes: validated.notes || null,
        lab_id: validated.selectedLabId,
        lab_name: selectedLabData?.name,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Request submitted successfully",
        description: `Your QA test has been scheduled with ${selectedLabData?.name}. They will contact you soon.`,
      });

      navigate("/qa-reports");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit QA request. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Schedule Quality Assurance Test</h1>
            <p className="text-muted-foreground text-lg">
              Select a certified testing lab and submit your produce for quality certification
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Lab Selection Section */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl">Step 1: Choose QA Testing Lab</CardTitle>
                <CardDescription>
                  Select from our network of certified quality assurance laboratories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search labs by name, location, or specialty..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Labs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-1">
                    {filteredLabs.map((lab) => (
                      <Card
                        key={lab.id}
                        className={`p-4 cursor-pointer transition-all border-2 hover:border-primary/50 ${
                          selectedLab === lab.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border'
                        }`}
                        onClick={() => setSelectedLab(lab.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">{lab.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <MapPin className="w-3 h-3" />
                              <span>{lab.location}</span>
                              <span>•</span>
                              <span>{lab.distance}</span>
                            </div>
                          </div>
                          {selectedLab === lab.id && (
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                          )}
                        </div>

                        {/* Rating and Certification */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{lab.rating}</span>
                            <span className="text-xs text-muted-foreground">({lab.reviews})</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {lab.certification}
                          </Badge>
                        </div>

                        {/* Specialties */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {lab.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>

                        {/* Features */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {lab.estimatedTime}
                            </div>
                            {lab.pickupAvailable && (
                              <div className="flex items-center gap-1">
                                <Truck className="w-3 h-3" />
                                Pickup
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {lab.phone}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test Details Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Step 2: Test Details</CardTitle>
                <CardDescription>
                  Provide information about your produce and testing requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="cropName">Crop Name</Label>
                    <Input
                      id="cropName"
                      name="cropName"
                      placeholder="e.g., Foxtail Millet"
                      value={formData.cropName}
                      onChange={(e) => handleInputChange('cropName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        step="0.01"
                        placeholder="100"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange('quantity', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Select 
                        name="unit" 
                        value={formData.unit} 
                        onValueChange={(value) => handleInputChange('unit', value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kilograms (kg)</SelectItem>
                          <SelectItem value="quintal">Quintal</SelectItem>
                          <SelectItem value="ton">Ton</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="testType">Test Type</Label>
                    <Select 
                      name="testType" 
                      value={formData.testType} 
                      onValueChange={(value) => handleInputChange('testType', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select test type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quality_check">Quality Check</SelectItem>
                        <SelectItem value="pesticide_residue">Pesticide Residue Test</SelectItem>
                        <SelectItem value="moisture_content">Moisture Content Test</SelectItem>
                        <SelectItem value="purity_test">Purity Test</SelectItem>
                        <SelectItem value="full_analysis">Full Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Any special requirements or information about your produce..."
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={4}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Selected Lab & Test Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Request QA Test Summary</CardTitle>
                <CardDescription>
                  Review your selected lab and test details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedLabData ? (
                  <div className="space-y-6">
                    {/* Lab Information */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Selected Lab
                      </h4>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h5 className="font-semibold text-foreground mb-2">{selectedLabData.name}</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{selectedLabData.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{selectedLabData.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>{selectedLabData.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{selectedLabData.hours}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Test Details */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <TestTube className="w-4 h-4" />
                        Test Details
                      </h4>
                      <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                        {formData.cropName && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              Crop:
                            </span>
                            <span className="font-medium text-foreground">{formData.cropName}</span>
                          </div>
                        )}
                        
                        {formData.quantity && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Quantity:</span>
                            <span className="font-medium text-foreground">
                              {formData.quantity} {formData.unit}
                            </span>
                          </div>
                        )}
                        
                        {formData.testType && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              Test Type:
                            </span>
                            <Badge variant="secondary" className="font-medium">
                              {getTestTypeDisplay(formData.testType)}
                            </Badge>
                          </div>
                        )}
                        
                        {!formData.cropName && !formData.quantity && !formData.testType && (
                          <div className="text-center py-4 text-muted-foreground">
                            <TestTube className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Fill in test details to see summary</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Lab Features */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Estimated Time:</span>
                        <span className="font-medium">{selectedLabData.estimatedTime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pickup Service:</span>
                        <span className="font-medium">
                          {selectedLabData.pickupAvailable ? "Available" : "Not Available"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Certification:</span>
                        <span className="font-medium">{selectedLabData.certification}</span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isLoading || !selectedLab || !formData.cropName || !formData.quantity || !formData.testType}
                      className="w-full"
                      onClick={(e) => {
                        const form = document.querySelector('form');
                        if (form) form.requestSubmit();
                      }}
                    >
                      {isLoading ? "Submitting..." : "Schedule QA Test"}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Please select a testing lab to continue</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QARequest;