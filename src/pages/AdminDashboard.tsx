import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminFormPanel from "../components/AdminFormPanel";
import AdminFirmsList from "../components/AdminFirmsList";
import AdminReviewFormPanel from "../components/AdminReviewFormPanel";
import AdminReviewsList from "../components/AdminReviewsList";
import { useAdminOperations } from "../hooks/useAdminOperations";
import { usePropFirms } from "../hooks/useSupabaseData";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [editingFirm, setEditingFirm] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const { propFirms, loading: firmsLoading, refetch } = usePropFirms();
  const { addFirm, updateFirm, deleteFirm, loading: firmOpLoading } = useAdminOperations();
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin");
    if (adminStatus === "true") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      navigate("/admin-login");
    }
    setIsChecking(false);
  }, [navigate]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-white text-lg">Checking admin access...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Admin Dashboard</h1>
          <p className="text-gray-300">Manage all prop firms and reviews from one place</p>
        </div>
        <Tabs defaultValue="firms" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-800/50">
            <TabsTrigger value="firms" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">All Firms</TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="firms">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AdminFormPanel
                onAdd={addFirm}
                onUpdate={updateFirm}
                editingFirm={editingFirm}
                setEditingFirm={setEditingFirm}
                loading={firmOpLoading}
              />
              <AdminFirmsList
                propFirms={propFirms}
                onEdit={setEditingFirm}
                onDelete={deleteFirm}
                loading={firmsLoading || firmOpLoading}
              />
            </div>
          </TabsContent>
          <TabsContent value="reviews">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AdminReviewFormPanel
                editingReview={editingReview}
                setEditingReview={setEditingReview}
                loading={false}
              />
              <AdminReviewsList
                onEdit={setEditingReview}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
