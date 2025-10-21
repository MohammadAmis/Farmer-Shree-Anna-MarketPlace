import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle, Download, Eye, TestTube } from "lucide-react";
import { Link } from "react-router-dom";

const QAReports = () => {
  const reports = [
    {
      lotId: "MLT1043",
      crop: "Finger Millet",
      variety: "Ragi",
      status: "certified",
      date: "12 Oct 2024",
      grade: "A+",
    },
    {
      lotId: "MLT1044",
      crop: "Pearl Millet",
      variety: "Bajra",
      status: "certified",
      date: "10 Oct 2024",
      grade: "A",
    },
    {
      lotId: "MLT1045",
      crop: "Foxtail Millet",
      variety: "Kangni",
      status: "pending",
      date: "-",
      grade: "-",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "certified":
        return (
          <Badge className="bg-success gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Certified
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="bg-warning text-warning-foreground gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="w-3 h-3" />
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Quality Assurance Reports</h1>
            <p className="text-muted-foreground">Track your produce quality certifications</p>
          </div>
          <Link to="/qa-request">
            <Button
              size="lg"
              variant="outline"
              className=" text-white border-white/20  bg-primary hover:bg-primary-hover w-full sm:w-auto backdrop-blur-sm"
            >
              <TestTube className="w-5 h-5" />
              Request QA Test
            </Button>
          </Link>
        </div>

        <Card className="p-6 shadow-custom-md overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Lot ID</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Crop</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Variety</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Grade</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Report Date</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.lotId} className="border-b last:border-0 hover:bg-muted/20 transition-base">
                  <td className="py-4 px-4">
                    <span className="font-medium text-foreground">{report.lotId}</span>
                  </td>
                  <td className="py-4 px-4 text-foreground">{report.crop}</td>
                  <td className="py-4 px-4 text-muted-foreground">{report.variety}</td>
                  <td className="py-4 px-4">{getStatusBadge(report.status)}</td>
                  <td className="py-4 px-4">
                    {report.grade !== "-" ? (
                      <span className="font-semibold text-success">{report.grade}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">{report.date}</td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      {report.status === "certified" && (
                        <>
                          <Button size="sm" variant="ghost" className="gap-1">
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                          <Button size="sm" variant="ghost" className="gap-1">
                            <Download className="w-4 h-4" />
                            PDF
                          </Button>
                        </>
                      )}
                      {report.status === "pending" && (
                        <span className="text-sm text-muted-foreground">In Progress</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        
      </main>
    </div>
  );
};

export default QAReports;
