import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import PropFirmSection from "../components/PropFirmSection";
import Footer from "../components/Footer";
import { usePropFirms } from "../hooks/useSupabaseData";
import { PropFirm } from "../types/supabase";

const Index = () => {
  const { propFirms, loading } = usePropFirms();
  const [sortBy, setSortBy] = useState<'price' | 'review' | 'trust'>('review');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchResults, setSearchResults] = useState<PropFirm[] | undefined>(undefined);

  // Check admin status on component mount
  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin");
    const isAdminUser = adminStatus === "true";
    setIsAdmin(isAdminUser);
    
    // If user is admin and was in admin mode before, restore admin mode
    const adminModeStatus = localStorage.getItem("adminMode");
    if (isAdminUser && adminModeStatus === "true") {
      setIsAdminMode(true);
    }
  }, []);

  // Save admin mode state to localStorage
  useEffect(() => {
    localStorage.setItem("adminMode", isAdminMode.toString());
  }, [isAdminMode]);

  const handleSearchResults = (results: PropFirm[]) => {
    setSearchResults(results);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
      <Hero 
        propFirms={propFirms}
        onSearchResults={handleSearchResults}
      />
      
      <PropFirmSection 
        propFirms={propFirms}
        sortBy={sortBy}
        setSortBy={setSortBy}
        loading={loading}
        searchResults={searchResults}
      />
      <Footer />
    </div>
  );
};

export default Index;
