import { useReviewOperations } from '@/hooks/useReviewOperations';
import { usePropFirms } from '@/hooks/useSupabaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const AdminReviewsList = ({ onEdit }: any) => {
  const { reviews, deleteReview, loading, fetchReviews } = useReviewOperations();
  const { propFirms } = usePropFirms();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getFirmName = (firm_id: string) => {
    const firm = propFirms.find((f: any) => f.id === firm_id);
    return firm ? firm.name : 'Unknown';
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteReview(id);
    setDeletingId(null);
    fetchReviews();
  };

  // Filter out reviews for MyForexFunds and The Funded Trader
  const filteredReviews = reviews.filter((review: any) => {
    const firmName = getFirmName(review.firm_id);
    return firmName !== 'MyForexFunds' && firmName !== 'The Funded Trader';
  });

  return (
    <Card className="bg-slate-800/50 border-blue-500/20">
      <CardHeader>
        <CardTitle className="text-white text-xl mb-2">All Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-gray-400">Loading reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-gray-400">No reviews found.</div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review: any) => (
              <div key={review.id} className="bg-slate-700 rounded p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-blue-400 font-semibold">{getFirmName(review.firm_id)}</div>
                    <div className="text-white font-bold text-lg">{review.title}</div>
                    <div className="text-yellow-400">Rating: {review.rating} / 5</div>
                    <div className="text-gray-300 text-sm">By: {review.reviewer_name}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => onEdit(review)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(review.id)} disabled={deletingId === review.id}>
                      {deletingId === review.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>
                <div className="text-gray-200 mt-2">{review.content}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminReviewsList; 