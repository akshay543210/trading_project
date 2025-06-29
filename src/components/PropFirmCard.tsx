import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PropFirm } from "@/types/supabase";

interface PropFirmCardProps {
  firm: PropFirm;
  index?: number;
}

const PropFirmCard = ({ firm, index = 0 }: PropFirmCardProps) => {
  const navigate = useNavigate();

  const discountPercentage = Math.round(((firm.original_price - firm.price) / firm.original_price) * 100);

  const handleBuyNow = () => {
    if (firm.affiliate_url) {
      window.open(firm.affiliate_url, '_blank');
    }
  };

  const handleViewReview = () => {
    navigate(`/firms/${firm.slug}`);
  };

  return (
    <Card 
      className="bg-slate-800/50 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-105 animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardHeader>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">{firm.name}</h3>
          {firm.brand && (
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {firm.brand}
            </Badge>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-400">${firm.price}</span>
            <span className="text-lg text-gray-400 line-through">${firm.original_price}</span>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              -{discountPercentage}%
            </Badge>
          </div>
          
          {firm.coupon_code && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <div className="text-sm text-blue-400 font-medium">Coupon Code</div>
              <div className="text-lg font-bold text-white">{firm.coupon_code}</div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-gray-300 mb-4">{firm.description}</p>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Review Score</span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-white font-semibold">{firm.review_score}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Trust Rating</span>
            <span className="text-green-400 font-semibold">{firm.trust_rating}/10</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Profit Split</span>
            <span className="text-blue-400 font-semibold">{firm.profit_split}%</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Payout Rate</span>
            <span className="text-purple-400 font-semibold">{firm.payout_rate}%</span>
          </div>

          {firm.platform && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Platform</span>
              <span className="text-gray-300 font-semibold">{firm.platform}</span>
            </div>
          )}
        </div>

        {/* Account Sizes Table */}
        {firm.account_sizes && firm.account_sizes.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Account Sizes & Pricing</h4>
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-blue-500/20">
                    <TableHead className="text-xs text-gray-400 font-medium">Size</TableHead>
                    <TableHead className="text-xs text-gray-400 font-medium">Original</TableHead>
                    <TableHead className="text-xs text-gray-400 font-medium">Discount</TableHead>
                    <TableHead className="text-xs text-gray-400 font-medium">Launch Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {firm.account_sizes.map((account, index) => {
                    const discountPercentage = Math.round(((account.original_price - account.discount_price) / account.original_price) * 100);
                    return (
                      <TableRow key={index} className="border-blue-500/10 hover:bg-blue-500/5">
                        <TableCell className="text-sm text-white font-medium">{account.size}</TableCell>
                        <TableCell className="text-sm text-gray-400 line-through">${account.original_price}</TableCell>
                        <TableCell className="text-sm text-green-400 font-semibold">
                          ${account.discount_price}
                          <Badge className="ml-2 bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                            -{discountPercentage}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-300">
                          {new Date(account.launch_date).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
        
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Key Features:</h4>
          <ul className="space-y-1">
            {firm.features.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="text-sm text-gray-400 flex items-center">
                <span className="text-blue-400 mr-2">•</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="gap-2 flex-col">
        <div className="flex gap-2 w-full">
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700 text-white transition-all hover:scale-105"
            onClick={handleBuyNow}
          >
            Buy Now
          </Button>
          <Button 
            variant="outline"
            className="flex-1 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-slate-900 transition-all"
            onClick={handleViewReview}
          >
            View Review
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PropFirmCard;
