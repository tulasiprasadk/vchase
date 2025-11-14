import React, { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Calculator, RotateCcw } from "lucide-react";

interface ROICalcProps {
  initialCost?: number;
  initialValues?: {
    brandVisibility?: number;
    digitalPromotion?: number;
    prMediaCoverage?: number;
    groundActivation?: number;
    hospitalityNetworking?: number;
    other?: number;
    // sponsor-specific
    attendees?: number;
    ticketPrice?: number;
    sponsorshipsReceived?: number;
    platformCost?: number;
    speakerCost?: number;
    marketingCost?: number;
    // organizer-specific
    expectedAttendees?: number;
    avgTicketPrice?: number;
    conversionRate?: number;
    avgOrderValue?: number;
  };
  onClose?: () => void;
  title?: string;
  variant?: "sponsor" | "organizer";
}

const SponsorshipROICalculator: React.FC<ROICalcProps> = ({
  initialCost,
  initialValues,
  onClose,
  title,
  variant = "sponsor",
}) => {
  const [sponsorshipCost, setSponsorshipCost] = useState<string>(
    initialCost ? String(initialCost) : ""
  );
  const { userProfile } = useAuth();
  // resolvedVariant prefers explicit prop, otherwise infer from user role
  const resolvedVariant: "sponsor" | "organizer" =
    variant ??
    (userProfile?.userType === "organizer" ? "organizer" : "sponsor");
  // Sponsor-specific fields
  const [sponsorAttendees, setSponsorAttendees] = useState<string>(
    initialValues && initialValues.attendees
      ? String(initialValues.attendees)
      : ""
  );
  const [sponsorTicketPrice, setSponsorTicketPrice] = useState<string>(
    initialValues && initialValues.ticketPrice
      ? String(initialValues.ticketPrice)
      : ""
  );
  const [sponsorSponsorshipsReceived, setSponsorSponsorshipsReceived] =
    useState<string>(
      initialValues && initialValues.sponsorshipsReceived
        ? String(initialValues.sponsorshipsReceived)
        : ""
    );
  const [platformCost, setPlatformCost] = useState<string>(
    initialValues && initialValues.platformCost
      ? String(initialValues.platformCost)
      : ""
  );
  const [speakerCost, setSpeakerCost] = useState<string>(
    initialValues && initialValues.speakerCost
      ? String(initialValues.speakerCost)
      : ""
  );
  const [marketingCost, setMarketingCost] = useState<string>(
    initialValues && initialValues.marketingCost
      ? String(initialValues.marketingCost)
      : ""
  );
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

  // Organizer-specific fields
  const [expectedAttendees, setExpectedAttendees] = useState<string>(
    initialValues && initialValues.expectedAttendees
      ? String(initialValues.expectedAttendees)
      : ""
  );
  const [avgTicketPrice, setAvgTicketPrice] = useState<string>(
    initialValues && initialValues.avgTicketPrice
      ? String(initialValues.avgTicketPrice)
      : ""
  );
  const [conversionRate, setConversionRate] = useState<string>(
    initialValues && initialValues.conversionRate
      ? String(initialValues.conversionRate)
      : ""
  );
  const [avgOrderValue, setAvgOrderValue] = useState<string>(
    initialValues && initialValues.avgOrderValue
      ? String(initialValues.avgOrderValue)
      : ""
  );

  // initialize from props once
  React.useEffect(() => {
    if (initialValues) {
      setBrandVisibilityValue(
        initialValues.brandVisibility
          ? String(initialValues.brandVisibility)
          : ""
      );
      setDigitalPromotionValue(
        initialValues.digitalPromotion
          ? String(initialValues.digitalPromotion)
          : ""
      );
      setPrMediaCoverageValue(
        initialValues.prMediaCoverage
          ? String(initialValues.prMediaCoverage)
          : ""
      );
      setGroundActivationValue(
        initialValues.groundActivation
          ? String(initialValues.groundActivation)
          : ""
      );
      setHospitalityNetworkingValue(
        initialValues.hospitalityNetworking
          ? String(initialValues.hospitalityNetworking)
          : ""
      );
      setOtherValue(initialValues.other ? String(initialValues.other) : "");
      // organizer fields
      if (initialValues.expectedAttendees)
        setExpectedAttendees(String(initialValues.expectedAttendees));
      if (initialValues.avgTicketPrice)
        setAvgTicketPrice(String(initialValues.avgTicketPrice));
      if (initialValues.conversionRate)
        setConversionRate(String(initialValues.conversionRate));
      if (initialValues.avgOrderValue)
        setAvgOrderValue(String(initialValues.avgOrderValue));
    }
  }, [initialValues]);

  const totalValue = useMemo(() => {
    if (resolvedVariant.toLocaleLowerCase() === "organizer") {
      const attendees = parseFloat(expectedAttendees) || 0;
      const ticketPrice = parseFloat(avgTicketPrice) || 0;
      const convRate = (parseFloat(conversionRate) || 0) / 100;
      const orderValue = parseFloat(avgOrderValue) || 0;

      const revenueFromTickets = attendees * ticketPrice;
      const revenueFromConversions = attendees * convRate * orderValue;
      const media = parseFloat(prMediaCoverageValue) || 0;
      const digital = parseFloat(digitalPromotionValue) || 0;
      const other = parseFloat(otherValue) || 0;

      return (
        revenueFromTickets + revenueFromConversions + media + digital + other
      );
    }

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
    // organizer deps
    expectedAttendees,
    avgTicketPrice,
    conversionRate,
    avgOrderValue,
    resolvedVariant,
  ]);

  const roi = useMemo(() => {
    const cost = parseFloat(sponsorshipCost) || 0;
    if (cost === 0) return 0;
    return ((totalValue - cost) / cost) * 100;
  }, [totalValue, sponsorshipCost]);

  // Sponsor-specific computed values
  const ticketSales = useMemo(() => {
    const attendees = parseFloat(sponsorAttendees) || 0;
    const price = parseFloat(sponsorTicketPrice) || 0;
    return attendees * price;
  }, [sponsorAttendees, sponsorTicketPrice]);

  const totalIncome = useMemo(() => {
    const sponsorships = parseFloat(sponsorSponsorshipsReceived) || 0;
    return ticketSales + sponsorships;
  }, [ticketSales, sponsorSponsorshipsReceived]);

  const totalExpense = useMemo(() => {
    const p = parseFloat(platformCost) || 0;
    const s = parseFloat(speakerCost) || 0;
    const m = parseFloat(marketingCost) || 0;
    return p + s + m;
  }, [platformCost, speakerCost, marketingCost]);

  const sponsorProfit = useMemo(() => {
    return totalIncome - totalExpense;
  }, [totalIncome, totalExpense]);

  const sponsorROI = useMemo(() => {
    const cost = parseFloat(sponsorshipCost) || 0;
    if (cost === 0) return 0;
    return ((totalIncome - cost) / cost) * 100;
  }, [totalIncome, sponsorshipCost]);

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

  const netGain = totalValue - (parseFloat(sponsorshipCost) || 0);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between w-full">
          <div>
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-600">
                {title || "Sponsorship ROI Calculator"}
              </h3>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Estimate sponsorship return: enter the cost and the values you
              expect from the sponsorship (brand exposure, PR, digital
              promotion, hospitality, etc.).
            </p>
          </div>
          {onClose && (
            <div className="ml-4">
              <button
                onClick={onClose}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Inputs */}
          <div className="flex-1">
            <Input
              label="Sponsorship Cost (₹)"
              type="number"
              value={sponsorshipCost}
              onChange={(e) => setSponsorshipCost(e.target.value)}
              placeholder="Enter sponsorship cost"
            />
            {resolvedVariant.toLocaleLowerCase() === "organizer" ? (
              <div className="grid grid-cols-1 gap-3 mt-3">
                <Input
                  label="Expected Attendees"
                  type="number"
                  value={expectedAttendees}
                  onChange={(e) => setExpectedAttendees(e.target.value)}
                  placeholder="Enter expected attendees"
                />
                <Input
                  label="Avg Ticket Price (₹)"
                  type="number"
                  value={avgTicketPrice}
                  onChange={(e) => setAvgTicketPrice(e.target.value)}
                  placeholder="Average ticket price"
                />
                <Input
                  label="Conversion Rate (%)"
                  type="number"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(e.target.value)}
                  placeholder="% of attendees who convert"
                />
                <Input
                  label="Avg Order Value (₹)"
                  type="number"
                  value={avgOrderValue}
                  onChange={(e) => setAvgOrderValue(e.target.value)}
                  placeholder="Average revenue per conversion"
                />
                <Input
                  label="PR / Media Coverage Value (₹)"
                  type="number"
                  value={prMediaCoverageValue}
                  onChange={(e) => setPrMediaCoverageValue(e.target.value)}
                  placeholder="Earned media value"
                />
                <Input
                  label="Digital Promotion Value (₹)"
                  type="number"
                  value={digitalPromotionValue}
                  onChange={(e) => setDigitalPromotionValue(e.target.value)}
                  placeholder="Paid/organic digital value"
                />
                <Input
                  label="Other Value (₹)"
                  type="number"
                  value={otherValue}
                  onChange={(e) => setOtherValue(e.target.value)}
                  placeholder="Any additional measurable value"
                />
              </div>
            ) : resolvedVariant.toLocaleLowerCase() === "sponsor" ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                <Input
                  label="Number of Attendees"
                  type="number"
                  value={sponsorAttendees}
                  onChange={(e) => setSponsorAttendees(e.target.value)}
                  placeholder="Enter expected attendees"
                />
                <Input
                  label="Price per Ticket (₹)"
                  type="number"
                  value={sponsorTicketPrice}
                  onChange={(e) => setSponsorTicketPrice(e.target.value)}
                  placeholder="Ticket price"
                />
                <Input
                  label="Sponsorships Received (₹)"
                  type="number"
                  value={sponsorSponsorshipsReceived}
                  onChange={(e) =>
                    setSponsorSponsorshipsReceived(e.target.value)
                  }
                  placeholder="Total sponsorship revenue"
                />

                <div className="col-span-3 mt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-500">Ticket Sales</div>
                      <div className="mt-1 bg-white border rounded-md p-2">
                        ₹{ticketSales.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Total Income</div>
                      <div className="mt-1 bg-white border rounded-md p-2">
                        ₹{totalIncome.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <Input
                  label="Platform Cost (₹)"
                  type="number"
                  value={platformCost}
                  onChange={(e) => setPlatformCost(e.target.value)}
                  placeholder="Platform / venue cost"
                />
                <Input
                  label="Speaker/Artist Cost (₹)"
                  type="number"
                  value={speakerCost}
                  onChange={(e) => setSpeakerCost(e.target.value)}
                  placeholder="Speakers / talent cost"
                />
                <Input
                  label="Marketing Cost (₹)"
                  type="number"
                  value={marketingCost}
                  onChange={(e) => setMarketingCost(e.target.value)}
                  placeholder="Marketing cost"
                />
                <div className="col-span-3 mt-2">
                  <div className="text-xs text-gray-500">Total Expense</div>
                  <div className="mt-1 bg-white border rounded-md p-2">
                    ₹{totalExpense.toLocaleString()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <Input
                  label="Brand Exposure Value (₹)"
                  type="number"
                  value={brandVisibilityValue}
                  onChange={(e) => setBrandVisibilityValue(e.target.value)}
                  placeholder="e.g. estimated media value"
                />
                <Input
                  label="Digital Promotion Value (₹)"
                  type="number"
                  value={digitalPromotionValue}
                  onChange={(e) => setDigitalPromotionValue(e.target.value)}
                  placeholder="e.g. paid ads, social reach"
                />
                <Input
                  label="PR / Media Coverage Value (₹)"
                  type="number"
                  value={prMediaCoverageValue}
                  onChange={(e) => setPrMediaCoverageValue(e.target.value)}
                  placeholder="e.g. earned media value"
                />
                <Input
                  label="On-ground Activation Value (₹)"
                  type="number"
                  value={groundActivationValue}
                  onChange={(e) => setGroundActivationValue(e.target.value)}
                  placeholder="e.g. product demos, sampling"
                />
                <Input
                  label="Hospitality & Networking Value (₹)"
                  type="number"
                  value={hospitalityNetworkingValue}
                  onChange={(e) =>
                    setHospitalityNetworkingValue(e.target.value)
                  }
                  placeholder="e.g. leads generated, meetings"
                />
                <Input
                  label="Other Value (₹)"
                  type="number"
                  value={otherValue}
                  onChange={(e) => setOtherValue(e.target.value)}
                  placeholder="Any additional measurable value"
                />
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <Button onClick={() => setShowROI(true)} className="flex-1">
                Calculate ROI
              </Button>
              <Button
                variant="outline"
                onClick={reset}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="w-full md:w-80 bg-gray-50 border border-gray-100 rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="text-sm text-gray-600">Total Value</div>
            {resolvedVariant.toLocaleLowerCase() === "sponsor" ? (
              <div className="text-2xl font-bold mt-1">
                ₹{totalIncome.toLocaleString()}
              </div>
            ) : (
              <div className="text-2xl font-bold mt-1">
                ₹{totalValue.toLocaleString()}
              </div>
            )}

            <div className="mt-4 text-sm text-gray-600">Profit</div>
            {resolvedVariant.toLocaleLowerCase() === "sponsor" ? (
              <div
                className={`text-xl font-semibold mt-1 ${
                  sponsorProfit >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ₹{sponsorProfit.toLocaleString()}
              </div>
            ) : (
              <div
                className={`text-xl font-semibold mt-1 ${
                  netGain >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ₹{netGain.toLocaleString()}
              </div>
            )}

            <div className="mt-4 text-sm text-gray-600">ROI</div>
            <div className="mt-2 flex items-center justify-center">
              {/* Improved circular donut graph */}
              {(() => {
                const raw = Number.isFinite(
                  Number(
                    resolvedVariant.toLocaleLowerCase() === "sponsor"
                      ? sponsorROI
                      : roi
                  )
                )
                  ? resolvedVariant.toLocaleLowerCase() === "sponsor"
                    ? sponsorROI
                    : roi
                  : 0;
                const display = Number.isFinite(raw) ? raw : 0;
                // Map 100% ROI to full circle; cap display for visualization
                const posProgress =
                  display > 0 ? Math.min(display / 100, 1) : 0;
                const negProgress =
                  display < 0 ? Math.min(Math.abs(display) / 100, 1) : 0;

                const radius = 44;
                const stroke = 10;
                const normalizedRadius = radius - stroke / 2;
                const circumference = normalizedRadius * 2 * Math.PI;

                const posOffset = circumference - posProgress * circumference;
                const negOffset = circumference - negProgress * circumference;

                return (
                  <svg
                    height={radius * 2}
                    width={radius * 2}
                    role="img"
                    aria-label={`ROI ${display.toFixed(2)} percent`}
                  >
                    <defs>
                      <linearGradient id="gradGreen" x1="0%" x2="100%">
                        <stop offset="0%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#16a34a" />
                      </linearGradient>
                      <linearGradient id="gradRed" x1="0%" x2="100%">
                        <stop offset="0%" stopColor="#f87171" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>

                    <g transform={`translate(${radius}, ${radius})`}>
                      {/* Background ring */}
                      <circle
                        r={normalizedRadius}
                        fill="transparent"
                        stroke="#f3f4f6"
                        strokeWidth={stroke}
                      />

                      {/* Positive ROI arc (green) */}
                      {posProgress > 0 && (
                        <circle
                          r={normalizedRadius}
                          fill="transparent"
                          stroke="url(#gradGreen)"
                          strokeWidth={stroke}
                          strokeLinecap="round"
                          strokeDasharray={`${circumference} ${circumference}`}
                          strokeDashoffset={posOffset}
                          transform={`rotate(-90)`}
                          style={{ transition: "stroke-dashoffset 600ms ease" }}
                        />
                      )}

                      {/* Negative ROI arc (red) drawn reverse */}
                      {negProgress > 0 && (
                        <circle
                          r={normalizedRadius}
                          fill="transparent"
                          stroke="url(#gradRed)"
                          strokeWidth={stroke}
                          strokeLinecap="round"
                          strokeDasharray={`${circumference} ${circumference}`}
                          strokeDashoffset={negOffset}
                          transform={`rotate(90)`} // reverse direction
                          style={{ transition: "stroke-dashoffset 600ms ease" }}
                        />
                      )}

                      {/* Center Label */}
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="text-lg font-bold"
                        style={{
                          fontSize: 14,
                          fill: display >= 0 ? "#16a34a" : "#ef4444",
                        }}
                      >
                        {isNaN(display) ? "0.00%" : `${display.toFixed(2)}%`}
                      </text>
                      <text
                        x="0"
                        y="18"
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{ fontSize: 10, fill: "#6b7280" }}
                      >
                        ROI
                      </text>
                    </g>
                  </svg>
                );
              })()}
            </div>

            <div className="w-full mt-4">
              <div className="text-xs text-gray-500 mb-1">
                Value / Cost Ratio
              </div>
              <div className="w-full bg-white border rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 bg-gradient-to-r from-green-400 to-green-600"
                  style={{
                    width: `${Math.min(
                      300,
                      Math.max(
                        0,
                        (totalValue / (parseFloat(sponsorshipCost) || 1)) * 100
                      )
                    )}%`,
                  }}
                />
              </div>
            </div>

            {showROI && (
              <div className="mt-4 w-full text-center">
                <div className="text-sm text-gray-600">Calculated Results</div>
                {resolvedVariant.toLocaleLowerCase() === "sponsor" ? (
                  <>
                    <div className="text-sm text-gray-700 mt-1">
                      Total Income: ₹{totalIncome.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-700">
                      Total Expense: ₹{totalExpense.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-700">
                      Profit: ₹{sponsorProfit.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-700">
                      ROI: {sponsorROI.toFixed(2)}%
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-sm text-gray-700 mt-1">
                      Total Value: ₹{totalValue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-700">
                      Net Gain: ₹{netGain.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-700">
                      ROI: {roi.toFixed(2)}%
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SponsorshipROICalculator;
