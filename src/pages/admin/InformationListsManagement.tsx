
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Plus, X, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ListItem {
  id: string;
  name: string;
  type?: string;
}

interface InformationList {
  id: string;
  title: string;
  items: ListItem[];
  tableName?: 'greek_life' | 'clubs' | 'activities' | 'sports' | 'majors';
}

const InformationListsManagement = () => {
  const [lists, setLists] = useState<InformationList[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with default lists
  useEffect(() => {
    const initializeLists = () => {
      const defaultLists: InformationList[] = [
        {
          id: 'greek-life',
          title: 'Greek Life Organizations',
          tableName: 'greek_life',
          items: []
        },
        {
          id: 'clubs',
          title: 'College Clubs',
          tableName: 'clubs',
          items: []
        },
        {
          id: 'activities',
          title: 'College Activities',
          tableName: 'activities',
          items: []
        },
        {
          id: 'sports',
          title: 'Sports',
          tableName: 'sports',
          items: []
        },
        {
          id: 'majors',
          title: 'Academic Majors',
          tableName: 'majors',
          items: []
        },
        {
          id: 'application-types',
          title: 'Application Types',
          items: [
            { id: '1', name: 'Undergraduate college' },
            { id: '2', name: 'PhD programs' },
            { id: '3', name: 'Medical school' },
            { id: '4', name: 'Law school' },
            { id: '5', name: 'Dentistry school' },
            { id: '6', name: 'Master programs' }
          ]
        },
        {
          id: 'mentor-activities',
          title: 'Mentor College Activities (Checkboxes)',
          items: [
            { id: '1', name: 'Student Government' },
            { id: '2', name: 'Academic Clubs' },
            { id: '3', name: 'Research' },
            { id: '4', name: 'Internships' },
            { id: '5', name: 'Study Abroad' },
            { id: '6', name: 'Volunteer Work' },
            { id: '7', name: 'Sports Teams' },
            { id: '8', name: 'Honor Societies' },
            { id: '9', name: 'Cultural Organizations' },
            { id: '10', name: 'Professional Organizations' }
          ]
        },
        {
          id: 'mentor-clubs',
          title: 'Mentor College Clubs (Checkboxes)',
          items: [
            { id: '1', name: 'Debate Team' },
            { id: '2', name: 'Drama Club' },
            { id: '3', name: 'Music Ensembles' },
            { id: '4', name: 'Academic Honor Societies' },
            { id: '5', name: 'Pre-professional Clubs' },
            { id: '6', name: 'Cultural Clubs' },
            { id: '7', name: 'Service Clubs' },
            { id: '8', name: 'Special Interest Groups' }
          ]
        }
      ];
      
      setLists(defaultLists);
      loadDatabaseData(defaultLists);
    };

    initializeLists();
  }, []);

  const loadDatabaseData = async (defaultLists: InformationList[]) => {
    try {
      for (const list of defaultLists) {
        if (list.tableName) {
          let data: any[] = [];
          let error: any = null;

          // Type-safe database queries
          switch (list.tableName) {
            case 'greek_life':
              const greekLifeResult = await supabase
                .from('greek_life')
                .select('*')
                .order('name');
              data = greekLifeResult.data || [];
              error = greekLifeResult.error;
              break;
            
            case 'clubs':
              const clubsResult = await supabase
                .from('clubs')
                .select('*')
                .order('name');
              data = clubsResult.data || [];
              error = clubsResult.error;
              break;
            
            case 'activities':
              const activitiesResult = await supabase
                .from('activities')
                .select('*')
                .order('name');
              data = activitiesResult.data || [];
              error = activitiesResult.error;
              break;
            
            case 'sports':
              const sportsResult = await supabase
                .from('sports')
                .select('*')
                .order('name');
              data = sportsResult.data || [];
              error = sportsResult.error;
              break;
            
            case 'majors':
              const majorsResult = await supabase
                .from('majors')
                .select('*')
                .order('name');
              data = majorsResult.data || [];
              error = majorsResult.error;
              break;
          }

          if (error) {
            console.error(`Error loading ${list.tableName}:`, error);
            continue;
          }

          if (data) {
            const items = data.map(item => ({
              id: item.id,
              name: item.name,
              ...(item.type && { type: item.type })
            }));

            setLists(prev => prev.map(l => 
              l.id === list.id 
                ? { ...l, items }
                : l
            ));
          }
        }
      }
    } catch (error) {
      console.error('Error loading database data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (listId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [listId]: !prev[listId]
    }));
  };

  const addItem = (listId: string) => {
    setLists(prev => prev.map(list => 
      list.id === listId 
        ? {
            ...list,
            items: [
              ...list.items,
              {
                id: `temp-${Date.now()}`,
                name: '',
                ...(list.id === 'greek-life' && { type: '' })
              }
            ]
          }
        : list
    ));
  };

  const updateItem = (listId: string, itemId: string, field: string, value: string) => {
    setLists(prev => prev.map(list =>
      list.id === listId
        ? {
            ...list,
            items: list.items.map(item =>
              item.id === itemId
                ? { ...item, [field]: value }
                : item
            )
          }
        : list
    ));
  };

  const removeItem = (listId: string, itemId: string) => {
    setLists(prev => prev.map(list =>
      list.id === listId
        ? {
            ...list,
            items: list.items.filter(item => item.id !== itemId)
          }
        : list
    ));
  };

  const saveList = async (list: InformationList) => {
    if (!list.tableName) {
      toast.success(`${list.title} updated (stored locally)`);
      return;
    }

    try {
      // Type-safe database operations
      const itemsToInsert = list.items
        .filter(item => item.name.trim() !== '')
        .map(item => ({
          name: item.name,
          ...(item.type && { type: item.type })
        }));

      switch (list.tableName) {
        case 'greek_life':
          // Delete existing items
          await supabase
            .from('greek_life')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');

          // Insert new items
          if (itemsToInsert.length > 0) {
            const { error: insertError } = await supabase
              .from('greek_life')
              .insert(itemsToInsert);
            if (insertError) throw insertError;
          }
          break;

        case 'clubs':
          await supabase
            .from('clubs')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');

          if (itemsToInsert.length > 0) {
            const { error: insertError } = await supabase
              .from('clubs')
              .insert(itemsToInsert.map(item => ({ name: item.name })));
            if (insertError) throw insertError;
          }
          break;

        case 'activities':
          await supabase
            .from('activities')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');

          if (itemsToInsert.length > 0) {
            const { error: insertError } = await supabase
              .from('activities')
              .insert(itemsToInsert.map(item => ({ 
                name: item.name,
                type: 'club' as const // Default type for activities
              })));
            if (insertError) throw insertError;
          }
          break;

        case 'sports':
          await supabase
            .from('sports')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');

          if (itemsToInsert.length > 0) {
            const { error: insertError } = await supabase
              .from('sports')
              .insert(itemsToInsert.map(item => ({ name: item.name })));
            if (insertError) throw insertError;
          }
          break;

        case 'majors':
          await supabase
            .from('majors')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');

          if (itemsToInsert.length > 0) {
            const { error: insertError } = await supabase
              .from('majors')
              .insert(itemsToInsert.map(item => ({ name: item.name })));
            if (insertError) throw insertError;
          }
          break;
      }

      toast.success(`${list.title} saved successfully`);
      
      // Reload the data to get proper IDs
      loadDatabaseData([list]);
      
    } catch (error) {
      console.error('Error saving list:', error);
      toast.error(`Failed to save ${list.title}`);
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
            <p className="mt-4 text-navy">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-navy mb-8">
          Information Lists Management
        </h1>
        <p className="text-gray-600 mb-8">
          Manage dropdown options and form choices used throughout the application.
        </p>

        <div className="space-y-6">
          {lists.map((list) => (
            <Card key={list.id}>
              <Collapsible 
                open={expandedSections[list.id]} 
                onOpenChange={() => toggleSection(list.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{list.title}</CardTitle>
                        <CardDescription>
                          {list.items.length} items
                          {list.tableName && " (Database)"}
                        </CardDescription>
                      </div>
                      {expandedSections[list.id] ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {list.items.map((item, index) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="flex-1">
                            <Label htmlFor={`item-${item.id}`}>Name</Label>
                            <Input
                              id={`item-${item.id}`}
                              value={item.name}
                              onChange={(e) => updateItem(list.id, item.id, 'name', e.target.value)}
                              placeholder="Enter name"
                            />
                          </div>
                          
                          {list.id === 'greek-life' && (
                            <div className="flex-1">
                              <Label htmlFor={`type-${item.id}`}>Type</Label>
                              <Input
                                id={`type-${item.id}`}
                                value={item.type || ''}
                                onChange={(e) => updateItem(list.id, item.id, 'type', e.target.value)}
                                placeholder="e.g., Fraternity, Sorority"
                              />
                            </div>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(list.id, item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => addItem(list.id)}
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Item
                        </Button>
                        
                        <Button
                          onClick={() => saveList(list)}
                          className="flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          Save {list.title}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InformationListsManagement;
