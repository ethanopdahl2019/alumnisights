
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPresetMessages } from "@/services/messaging";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PresetMessageSelectorProps {
  onSelect: (message: string) => void;
}

export const PresetMessageSelector: React.FC<PresetMessageSelectorProps> = ({ onSelect }) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { data: presetMessages, isLoading } = useQuery({
    queryKey: ["preset-messages"],
    queryFn: getPresetMessages
  });

  if (isLoading) {
    return <div className="h-40 flex items-center justify-center">Loading preset messages...</div>;
  }

  if (!presetMessages?.length) {
    return <div className="text-center text-gray-500 py-4">No preset messages available</div>;
  }

  // Get unique categories
  const categories = Array.from(
    new Set(presetMessages.map((msg) => msg.category || "other"))
  );

  const filteredMessages = activeCategory === "all" 
    ? presetMessages 
    : presetMessages.filter((msg) => msg.category === activeCategory);

  return (
    <div className="border rounded-lg overflow-hidden">
      <Tabs defaultValue="all" onValueChange={setActiveCategory}>
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.slice(0, 2).map((category) => (
            <TabsTrigger key={category} value={category}>
              {category?.charAt(0).toUpperCase() + category?.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeCategory} className="mt-0">
          <ScrollArea className="h-40">
            <div className="p-3 space-y-2">
              {filteredMessages.map((msg) => (
                <Button 
                  key={msg.id} 
                  variant="ghost" 
                  className="w-full justify-start text-left h-auto py-2 font-normal text-sm"
                  onClick={() => onSelect(msg.content)}
                >
                  {msg.content}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
