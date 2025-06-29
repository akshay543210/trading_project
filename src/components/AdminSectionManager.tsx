import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  DollarSign, 
  Trophy, 
  Globe, 
  MessageSquare, 
  Users, 
  GraduationCap,
  Award,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { useSectionOperations } from "@/hooks/useSectionOperations";
import { usePropFirms } from "@/hooks/useSupabaseData";
import AdminReviewFormPanel from "@/components/AdminReviewFormPanel";
import AdminReviewsList from "@/components/AdminReviewsList";

const getSectionIcon = (type: string) => {
  switch (type) {
    case "propfirms":
      return <Building2 className="h-5 w-5" />;
    case "reviews":
      return <MessageSquare className="h-5 w-5" />;
    case "category":
      return <GraduationCap className="h-5 w-5" />;
    default:
      return <Building2 className="h-5 w-5" />;
  }
};

const AdminSectionManager = () => {
  const {
    sections,
    sectionFirms,
    loading,
    addSection,
    updateSection,
    deleteSection,
    addPropFirmToSection,
    removePropFirmFromSection,
    fetchSections,
    fetchSectionFirms
  } = useSectionOperations();
  const { propFirms } = usePropFirms();
  const [newSection, setNewSection] = useState({ name: "", type: "propfirms" });
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editSection, setEditSection] = useState({ name: "", type: "propfirms" });
  const [selectedPropFirm, setSelectedPropFirm] = useState<{ [key: string]: string }>({});

  // Add Section
  const handleAddSection = async () => {
    if (!newSection.name) return;
    await addSection(newSection);
    setNewSection({ name: "", type: "propfirms" });
    fetchSections();
  };

  // Edit Section
  const handleEditSection = async (id: string) => {
    await updateSection(id, editSection);
    setEditingSectionId(null);
    setEditSection({ name: "", type: "propfirms" });
    fetchSections();
  };

  // Delete Section
  const handleDeleteSection = async (id: string) => {
    await deleteSection(id);
    fetchSections();
  };

  // Add PropFirm to Section
  const handleAddPropFirm = async (sectionId: string) => {
    const propFirmId = selectedPropFirm[sectionId];
    if (!propFirmId) return;
    await addPropFirmToSection(sectionId, propFirmId);
    setSelectedPropFirm((prev) => ({ ...prev, [sectionId]: "" }));
    fetchSectionFirms();
  };

  // Remove PropFirm from Section
  const handleRemovePropFirm = async (sectionFirmId: string) => {
    await removePropFirmFromSection(sectionFirmId);
    fetchSectionFirms();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Section Management</h2>
        <p className="text-gray-300">
          Manage different sections of your website. Changes here will reflect on the live site.
        </p>
      </div>
      <Tabs defaultValue="firms" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-800/50">
          <TabsTrigger value="firms">All Firms</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="firms">
          {/* Add Section */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Section name"
              value={newSection.name}
              onChange={e => setNewSection({ ...newSection, name: e.target.value })}
              className="px-3 py-2 rounded bg-slate-800 text-white border border-blue-500/20"
            />
            <select
              value={newSection.type}
              onChange={e => setNewSection({ ...newSection, type: e.target.value })}
              className="px-3 py-2 rounded bg-slate-800 text-white border border-blue-500/20"
            >
              <option value="propfirms">PropFirms</option>
              <option value="reviews">Reviews</option>
              <option value="category">Category</option>
            </select>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleAddSection}>
              <Plus className="h-4 w-4 mr-2" /> Add Section
            </Button>
          </div>
          {/* Section Tabs (not nested) */}
          <div className="mb-6">
            <div className="grid grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
              {sections.map((section) => (
                <button
                  key={section.id}
                  className={`px-2 py-1 rounded ${editingSectionId === section.id ? 'bg-blue-600 text-white' : 'bg-slate-700 text-blue-400'}`}
                  onClick={() => setEditingSectionId(section.id)}
                >
                  {getSectionIcon(section.type)} {section.name.split(' ')[0]}
                </button>
              ))}
            </div>
            {sections.map((section) => {
              if (editingSectionId !== section.id) return null;
              const firmsInSection = sectionFirms.filter(sf => sf.section_id === section.id);
              return (
                <Card key={section.id} className="bg-slate-800/50 border-blue-500/20 mb-4">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getSectionIcon(section.type)}
                        <div>
                          <CardTitle className="text-white text-xl">{section.name}</CardTitle>
                          <p className="text-gray-400 text-sm">Type: {section.type}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setEditSection({ name: section.name, type: section.type }); setEditingSectionId(section.id); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteSection(section.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{firmsInSection.length} items</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Add PropFirm to Section */}
                    <div className="flex gap-2 mb-4">
                      <select
                        value={selectedPropFirm[section.id] || ""}
                        onChange={e => setSelectedPropFirm(prev => ({ ...prev, [section.id]: e.target.value }))}
                        className="px-3 py-2 rounded bg-slate-800 text-white border border-blue-500/20"
                      >
                        <option value="">Select PropFirm</option>
                        {propFirms.map(firm => (
                          <option key={firm.id} value={firm.id}>{firm.name}</option>
                        ))}
                      </select>
                      <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAddPropFirm(section.id)}>
                        <Plus className="h-4 w-4 mr-2" /> Add PropFirm
                      </Button>
                    </div>
                    {/* List PropFirms in Section */}
                    {firmsInSection.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-gray-600 rounded-lg">
                        <div className="text-gray-400 mb-4">{getSectionIcon(section.type)}</div>
                        <h3 className="text-lg font-semibold text-gray-300 mb-2">No prop firms in this section</h3>
                        <p className="text-gray-400 mb-4">Start by adding your first prop firm to this section.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {firmsInSection.map(sf => {
                          const firm = propFirms.find(f => f.id === sf.prop_firm_id);
                          return (
                            <div key={sf.id} className="flex items-center justify-between bg-slate-700 rounded p-3">
                              <span className="text-white font-medium">{firm ? firm.name : sf.prop_firm_id}</span>
                              <Button size="sm" variant="destructive" onClick={() => handleRemovePropFirm(sf.id)}>
                                Remove
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        <TabsContent value="reviews">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AdminReviewFormPanel />
            <AdminReviewsList />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSectionManager;
