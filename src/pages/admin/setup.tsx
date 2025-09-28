import { useState } from "react";
import { addSampleData } from "@/lib/sampleData";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function AdminDataSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleAddSampleData = async () => {
    setIsLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const success = await addSampleData();
      if (success) {
        setStatus("success");
        setMessage("Sample data has been successfully added to Firestore!");
      } else {
        setStatus("error");
        setMessage("Failed to add sample data. Check console for details.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("An error occurred while adding sample data.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Database Setup
            </h1>
            <p className="text-gray-600">
              Add sample data to your Firestore database for testing the
              sponsorship platform.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">
                What this will add:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • 3 sample sponsorship applications with different statuses
                </li>
                <li>• 2 sample events available for sponsorship</li>
                <li>• Various sponsorship packages and pricing tiers</li>
                <li>• Realistic event data with locations and categories</li>
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <Button
                onClick={handleAddSampleData}
                disabled={isLoading}
                size="lg"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Sample Data...
                  </>
                ) : (
                  "Add Sample Data to Firestore"
                )}
              </Button>

              {status === "success" && (
                <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">{message}</span>
                </div>
              )}

              {status === "error" && (
                <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">{message}</span>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-900 mb-2">
                Important Notes:
              </h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>
                  • Make sure your Firebase project is configured correctly
                </li>
                <li>
                  • Update the sponsorId in the sample data to match your user
                  ID
                </li>
                <li>• This is for development/testing purposes only</li>
                <li>
                  • You can run this multiple times, but it will create
                  duplicate data
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
