import { useState, useEffect } from 'react';
import { useReviewOperations } from '@/hooks/useReviewOperations';
import { usePropFirms } from '@/hooks/useSupabaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const initialForm = {
  id: '',
  firm_id: '',
  user_id: '',
  reviewer_name: '',
  rating: 5,
  title: '',
  content: '',
};

const AdminReviewFormPanel = ({ editingReview, setEditingReview, loading }: any) => {
  const { addReview, updateReview, fetchReviews } = useReviewOperations();
  const { propFirms } = usePropFirms();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingReview) {
      setForm({ ...initialForm, ...editingReview });
    } else {
      setForm(initialForm);
    }
  }, [editingReview]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    if (!form.firm_id || !form.reviewer_name || !form.rating || !form.content) {
      setError('All fields except title are required.');
      return;
    }
    const reviewData = { ...form, user_id: form.user_id || null };
    if (editingReview) {
      await updateReview(form.id, reviewData);
      setEditingReview(null);
    } else {
      await addReview(reviewData);
    }
    setForm(initialForm);
    fetchReviews();
  };

  return (
    <Card className="bg-slate-800/50 border-blue-500/20">
      <CardHeader>
        <CardTitle className="text-white text-xl mb-2">
          {editingReview ? 'Edit Review' : 'Add Review'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Prop Firm</label>
            <select
              name="firm_id"
              value={form.firm_id}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-slate-700 text-white border border-blue-500/20"
              required
            >
              <option value="">Select a prop firm</option>
              {propFirms.map((firm: any) => (
                <option key={firm.id} value={firm.id}>{firm.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Reviewer Name</label>
            <input
              name="reviewer_name"
              value={form.reviewer_name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-slate-700 text-white border border-blue-500/20"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Rating</label>
            <input
              type="number"
              name="rating"
              value={form.rating}
              min={1}
              max={5}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-slate-700 text-white border border-blue-500/20"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-slate-700 text-white border border-blue-500/20"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Content</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-slate-700 text-white border border-blue-500/20"
              required
            />
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <div className="flex gap-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
              {editingReview ? 'Update Review' : 'Add Review'}
            </Button>
            {editingReview && (
              <Button type="button" variant="outline" onClick={() => setEditingReview(null)}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminReviewFormPanel; 