// src/components/QARequestModal.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TestTube, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const qaRequestSchema = z.object({
  cropName: z.string().trim().min(1, "Crop name is required").max(100),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.string().min(1, "Unit is required"),
  location: z.string().trim().min(1, "Location is required").max(200),
  testType: z.enum(["quality_check", "pesticide_residue", "moisture_content", "purity_test", "full_analysis"]),
  notes: z.string().max(500).optional(),
});

interface QARequestModalProps {
  onSuccess?: () => void;
}

export const QARequestModal = ({ onSuccess }: QARequestModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        cropName: formData.get("cropName") as string,
        quantity: parseFloat(formData.get("quantity") as string),
        unit: formData.get("unit") as string,
        location: formData.get("location") as string,
        testType: formData.get("testType") as string,
        notes: formData.get("notes") as string,
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
        location: validated.location,
        test_type: validated.testType,
        notes: validated.notes || null,
      });

      if (error) throw error;

      toast({
        title: "Request submitted successfully",
        description: "We will contact you soon regarding your QA test request.",
      });

      setOpen(false);
      onSuccess?.();
      
      // Reset form
      e.currentTarget.reset();
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          variant="outline"
          className="text-white border-white/20 bg-primary hover:bg-primary-hover w-full sm:w-auto backdrop-blur-sm"
        >
          <TestTube className="w-5 h-5" />
          Request QA Test
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <CardTitle className="text-2xl">Request Quality Assurance Test</CardTitle>
            <CardDescription className="mt-2">
              Submit your produce for quality testing to enhance buyer confidence
            </CardDescription>
          </div>
        </div>

        <CardContent className="p-6 max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cropName">Crop Name</Label>
              <Input
                id="cropName"
                name="cropName"
                placeholder="e.g., Foxtail Millet"
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
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select name="unit" defaultValue="kg" required>
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
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., Delhi, India"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="testType">Test Type</Label>
              <Select name="testType" required>
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
                placeholder="Any additional information about your produce or testing requirements..."
                rows={4}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </CardContent>
      </DialogContent>
    </Dialog>
  );
};