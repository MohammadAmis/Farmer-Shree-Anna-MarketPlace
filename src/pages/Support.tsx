// src/pages/Support.tsx
import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, MessageCircle, HelpCircle, Mail, MapPin, Send, Globe } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const messageSchema = z.object({
  content: z.string().trim().min(1, { message: "Message cannot be empty" }).max(1000),
});

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  is_support: boolean;
}

const Support = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [emailName, setEmailName] = useState("");
  const [emailPhone, setEmailPhone] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailSubjectText, setEmailSubjectText] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [callNumber, setCallNumber] = useState("");
  
  // Chat functionality
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Error",
          description: "Please log in to access support chat",
          variant: "destructive",
        });
        return;
      }
      setUserId(session.user.id);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        setUserId(null);
      } else {
        setUserId(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  useEffect(() => {
    if (!userId || activeModal !== 'whatsapp') return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${userId},is_support.eq.true`)
        .order("created_at", { ascending: true });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
        return;
      }

      setMessages(data || []);
    };

    fetchMessages();

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, activeModal, toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const validated = messageSchema.parse({ content: newMessage });
      setLoading(true);

      const { error } = await supabase.from("messages").insert({
        sender_id: userId,
        content: validated.content,
        is_support: false,
      });

      if (error) throw error;

      setNewMessage("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: "How do I create a new listing?",
      answer: "Navigate to the Dashboard and click on 'Create New Listing'. Follow the step-by-step form to add your produce details, pricing, images, and request QA testing if needed.",
    },
    {
      question: "How long does QA certification take?",
      answer: "Quality assurance testing typically takes 2-3 business days. You'll receive a notification once your report is ready, and can download the certificate from the QA Reports page.",
    },
    {
      question: "When will I receive my payment?",
      answer: "Payments are released from escrow within 24 hours after delivery confirmation. You can track payment status in the Orders & Payments section of your dashboard.",
    },
    {
      question: "Can I edit my listing after posting?",
      answer: "Yes, you can edit listings from your Dashboard. However, if buyers have already shown interest, certain fields may be locked to maintain transaction integrity.",
    },
    {
      question: "What are the delivery options available?",
      answer: "We offer standard delivery within 2-3 business days and express delivery within 24 hours. Delivery options may vary based on your location.",
    },
    {
      question: "How do I track my order?",
      answer: "You can track your order in the 'My Orders' section of your dashboard. You'll receive tracking information via email once your order ships.",
    },
  ];

  const emailSubjects = [
    "General Inquiry",
    "Account Support",
    "Payment Issues",
    "Listing Problems",
    "Delivery Questions",
    "Quality Assurance",
    "Technical Support",
    "Partnership Opportunities",
    "Other"
  ];

  const handleEmailSubmit = () => {
    if (emailName && emailSubject && emailMessage) {
      const subject = emailSubject === "Other" ? emailSubjectText : emailSubject;
      const body = `Name: ${emailName}\nPhone: ${emailPhone}\n\n${emailMessage}`;
      const mailtoLink = `mailto:support@shreeanna.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;
      setActiveModal(null);
      // Reset form
      setEmailName("");
      setEmailPhone("");
      setEmailSubject("");
      setEmailSubjectText("");
      setEmailMessage("");
    }
  };

  const handleCallSubmit = () => {
    if (callNumber) {
      window.location.href = `tel:${callNumber}`;
      setActiveModal(null);
      setCallNumber("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Support Center</h1>
          <p className="text-muted-foreground">We're here to help you succeed</p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card 
            className="p-6 shadow-custom-md hover:shadow-custom-lg transition-smooth gradient-card cursor-pointer" 
            onClick={() => setActiveModal('whatsapp')}
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">WhatsApp</h3>
            <p className="text-muted-foreground text-sm mb-4">Chat with our support team</p>
            <Button variant="outline" className="w-full">Chat Now</Button>
          </Card>

          <Card 
            className="p-6 shadow-custom-md hover:shadow-custom-lg transition-smooth gradient-card cursor-pointer" 
            onClick={() => setActiveModal('email')}
          >
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Email</h3>
            <p className="text-muted-foreground text-sm mb-4">Get a response within 24 hours</p>
            <Button variant="outline" className="w-full">Send Email</Button>
          </Card>

          <Card 
            className="p-6 shadow-custom-md hover:shadow-custom-lg transition-smooth gradient-card cursor-pointer" 
            onClick={() => setActiveModal('call')}
          >
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Call Us</h3>
            <p className="text-muted-foreground text-sm mb-4">Toll-free helpline available 24/7</p>
            <Button variant="outline" className="w-full">1800-XXX-XXXX</Button>
          </Card>
        </div>

        <div className="grid grid-cols-1">

          {/* FAQ Section */}
          <Card className="p-6 shadow-custom-md">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-accent" />
              Frequently Asked Questions
            </h2>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>

        {/* Location Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            Our Location
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6 shadow-custom-md">
              <h3 className="text-xl font-semibold text-foreground mb-4">Visit Us</h3>
              <div className="space-y-2">
                <p className="text-foreground font-medium">Shree Anna Agri Solutions</p>
                <p className="text-muted-foreground">123 Agriculture Hub, Farm District</p>
                <p className="text-muted-foreground">Bangalore, Karnataka 560001</p>
                <p className="text-muted-foreground">India</p>
                <p className="text-muted-foreground mt-4">Business Hours:</p>
                <p className="text-muted-foreground">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                <p className="text-muted-foreground">Sunday: Closed</p>
              </div>
            </Card>
            
            <Card className="p-4 shadow-custom-md h-64">
              {/* Interactive Map */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.426267910598!2d77.5941088740558!3d12.97159898742185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDU4JzE3LjgiTiA3N8KwMzUnMzguOCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Company Location Map"
              />
            </Card>
          </div>
        </div>
      </main>

      {/* WhatsApp Modal - Inlined Chat Component */}
      <Dialog 
        open={activeModal === 'whatsapp'} 
        onOpenChange={(open) => {
          if (!open) setActiveModal(null);
        }}
      >
        <DialogContent className="sm:max-w-lg max-w-2xl max-h-[80vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-500" />
              Support Chat
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 flex flex-col h-[60vh]">
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/10">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <p>No messages yet. Start a conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_id === userId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.sender_id === userId
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-6 border-t bg-background">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={loading}
                  className="flex-1"
                />
                <Button type="submit" disabled={loading || !newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Modal */}
      <Dialog open={activeModal === 'email'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-500" />
              Email Support
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-muted-foreground">
              Send us an email and we'll get back to you within 24 hours.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="email-name">Your Name</Label>
              <Input 
                id="email-name" 
                placeholder="Enter your name" 
                value={emailName}
                onChange={(e) => setEmailName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-phone">Phone Number</Label>
              <Input 
                id="email-phone" 
                type="tel" 
                placeholder="Enter your phone number" 
                value={emailPhone}
                onChange={(e) => setEmailPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-subject">Subject</Label>
              <Select value={emailSubject} onValueChange={setEmailSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {emailSubjects.map((subject, index) => (
                    <SelectItem key={index} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {emailSubject === "Other" && (
              <div className="space-y-2">
                <Label htmlFor="email-subject-text">Subject Details</Label>
                <Input 
                  id="email-subject-text" 
                  placeholder="Enter your subject" 
                  value={emailSubjectText}
                  onChange={(e) => setEmailSubjectText(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email-message">Message</Label>
              <Textarea 
                id="email-message" 
                placeholder="Your message here..." 
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setActiveModal(null);
                  setEmailName("");
                  setEmailPhone("");
                  setEmailSubject("");
                  setEmailSubjectText("");
                  setEmailMessage("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleEmailSubmit}>Send Email</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Call Modal */}
      <Dialog open={activeModal === 'call'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-500" />
              Call Support
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-muted-foreground">
              Enter your phone number and we'll call you back immediately.
            </p>
            <div className="space-y-2">
              <Label htmlFor="call-number">Your Phone Number</Label>
              <Input 
                id="call-number" 
                placeholder="+91 98765 43210" 
                value={callNumber}
                onChange={(e) => setCallNumber(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setActiveModal(null);
                  setCallNumber("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCallSubmit}>Call Now</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Support;