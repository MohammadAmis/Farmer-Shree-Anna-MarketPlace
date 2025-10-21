import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, FileText, Megaphone, BookOpen } from "lucide-react";
import qualityTestingImg from "@/assets/quality-testing.jpg";
import milletVarietiesImg from "@/assets/millet-varieties.jpg";

const Knowledge = () => {
  const videos = [
    {
      title: "How to Improve Millet Grading",
      duration: "8:45",
      category: "Tutorial",
    },
    {
      title: "Best Practices for Millet Storage",
      duration: "12:20",
      category: "Best Practices",
    },
    {
      title: "Understanding Quality Certifications",
      duration: "6:30",
      category: "Certification",
    },
  ];

  const articles = [
    {
      title: "Maximizing Millet Yield: A Complete Guide",
      excerpt: "Learn effective farming techniques to increase your millet production and quality...",
      readTime: "5 min read",
    },
    {
      title: "Market Trends in Millet Trading 2024",
      excerpt: "Stay updated with current market prices and demand patterns across India...",
      readTime: "4 min read",
    },
  ];

  const schemes = [
    {
      title: "National Food Security Mission - Millets",
      agency: "Govt. of India",
      deadline: "31 Dec 2024",
    },
    {
      title: "Pradhan Mantri Fasal Bima Yojana",
      agency: "Ministry of Agriculture",
      deadline: "Ongoing",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Knowledge Hub</h1>
          <p className="text-muted-foreground">Learn, grow, and stay informed</p>
        </div>

        {/* Video Tutorials */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Play className="w-6 h-6 text-primary" />
              Video Tutorials
            </h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <Card key={index} className="overflow-hidden shadow-custom-md hover:shadow-custom-lg transition-smooth cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Play className="w-16 h-16 text-primary" />
                </div>
                <div className="p-4">
                  <Badge variant="secondary" className="mb-2">{video.category}</Badge>
                  <h3 className="font-semibold text-foreground mb-2">{video.title}</h3>
                  <p className="text-sm text-muted-foreground">{video.duration}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Articles */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-6 h-6 text-accent" />
              Articles & Guides
            </h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article, index) => (
              <Card key={index} className="p-6 shadow-custom-md hover:shadow-custom-lg transition-smooth cursor-pointer gradient-card">
                <img
                  src={index === 0 ? milletVarietiesImg : qualityTestingImg}
                  alt={article.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold text-foreground mb-2">{article.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{article.readTime}</span>
                  <Button variant="link" className="text-primary p-0">Read More →</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Government Schemes */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-secondary-foreground" />
              Government Schemes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schemes.map((scheme, index) => (
              <Card key={index} className="p-6 shadow-custom-md gradient-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <Badge variant="outline">{scheme.deadline}</Badge>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{scheme.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{scheme.agency}</p>
                <Button variant="outline" size="sm" className="w-full">Learn More</Button>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Knowledge;
