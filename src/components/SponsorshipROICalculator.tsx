import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Calculator, RotateCcw } from "lucide-react";

const SponsorshipROICalculator: React.FC = () => {
  const [sponsorshipCost, setSponsorshipCost] = useState<string>("");
  const [brandVisibilityValue, setBrandVisibilityValue] = useState<string>("");
  const [digitalPromotionValue, setDigitalPromotionValue] =
    useState<string>("");
  const [prMediaCoverageValue, setPrMediaCoverageValue] = useState<string>("");
  const [groundActivationValue, setGroundActivationValue] =
    useState<string>("");
  const [hospitalityNetworkingValue, setHospitalityNetworkingValue] =
    useState<string>("");
  const [otherValue, setOtherValue] = useState<string>("");
  const [showROI, setShowROI] = useState<boolean>(false);

  const totalValue = useMemo(() => {
    const values = [
      parseFloat(brandVisibilityValue) || 0,
      parseFloat(digitalPromotionValue) || 0,
      parseFloat(prMediaCoverageValue) || 0,
      parseFloat(groundActivationValue) || 0,
      parseFloat(hospitalityNetworkingValue) || 0,
      parseFloat(otherValue) || 0,
    ];
    return values.reduce((sum, val) => sum + val, 0);
  }, [
    brandVisibilityValue,
    digitalPromotionValue,
    prMediaCoverageValue,
    groundActivationValue,
    hospitalityNetworkingValue,
    otherValue,
  ]);

  const roi = useMemo(() => {
    const cost = parseFloat(sponsorshipCost) || 0;
    if (cost === 0) return 0;
    return ((totalValue - cost) / cost) * 100;
  }, [totalValue, sponsorshipCost]);

  const reset = () => {
    setSponsorshipCost("");
    setBrandVisibilityValue("");
    setDigitalPromotionValue("");
    setPrMediaCoverageValue("");
    setGroundActivationValue("");
    setHospitalityNetworkingValue("");
    setOtherValue("");
    setShowROI(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          ISWPL Sponsorship ROI Calculator (INR)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="Sponsorship Cost (₹)"
          type="number"
          value={sponsorshipCost}
          onChange={(e) => setSponsorshipCost(e.target.value)}
          placeholder="Enter sponsorship cost"
        />
        <Input
          label="Brand Visibility Value (₹)"
          type="number"
          value={brandVisibilityValue}
          onChange={(e) => setBrandVisibilityValue(e.target.value)}
          placeholder="Enter brand visibility value"
        />
        <Input
          label="Digital Promotion Value (₹)"
          type="number"
          value={digitalPromotionValue}
          onChange={(e) => setDigitalPromotionValue(e.target.value)}
          placeholder="Enter digital promotion value"
        />
        <Input
          label="PR / Media Coverage Value (₹)"
          type="number"
          value={prMediaCoverageValue}
          onChange={(e) => setPrMediaCoverageValue(e.target.value)}
          placeholder="Enter PR/media coverage value"
        />
        <Input
          label="Ground Activation Value (₹)"
          type="number"
          value={groundActivationValue}
          onChange={(e) => setGroundActivationValue(e.target.value)}
          placeholder="Enter ground activation value"
        />
        <Input
          label="Hospitality / Networking Value (₹)"
          type="number"
          value={hospitalityNetworkingValue}
          onChange={(e) => setHospitalityNetworkingValue(e.target.value)}
          placeholder="Enter hospitality/networking value"
        />
        <Input
          label="Other Value (₹)"
          type="number"
          value={otherValue}
          onChange={(e) => setOtherValue(e.target.value)}
          placeholder="Enter other value"
        />

        <div className="pt-4 border-t">
          {showROI && (
            <>
              <div className="text-lg font-semibold">
                Total Value: ₹{totalValue.toLocaleString()}
              </div>
              <div className="text-xl font-bold text-green-600">
                ROI: {roi.toFixed(2)}%
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={() => setShowROI(true)} className="flex-1">
            Calculate ROI
          </Button>
          <Button
            variant="outline"
            onClick={reset}
            className="flex items-center gap-2 text-gray-800"
          >
            <RotateCcw className="h-4 w-4 text-gray-800" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SponsorshipROICalculator;
