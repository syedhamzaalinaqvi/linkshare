import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { WhatsAppGroup } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, MapPin, ExternalLink, Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatDistance } from "date-fns";

export default function GroupDetail() {
  const params = useParams<{ id: string }>();
  const groupId = parseInt(params.id);
  const [isCopied, setIsCopied] = useState(false);
  
  const { data: group, isLoading, error } = useQuery({
    queryKey: ['/api/groups', groupId],
    queryFn: async () => {
      const response = await fetch(`/api/groups/${groupId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch group');
      }
      return response.json() as Promise<WhatsAppGroup>;
    },
  });

  // Reset the copied state after 2 seconds
  useEffect(() => {
    if (isCopied) {
      const timeout = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [isCopied]);

  const copyLink = () => {
    if (group) {
      navigator.clipboard.writeText(group.link);
      setIsCopied(true);
      toast({
        title: "Link copied!",
        description: "The WhatsApp group link has been copied to your clipboard.",
      });
    }
  };

  // Format the timestamp to a readable date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate time ago
  const getTimeAgo = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return formatDistance(date, new Date(), { addSuffix: true });
  };

  // Open WhatsApp link
  const joinGroup = () => {
    if (group) {
      window.open(group.link, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Group not found</h2>
        <p className="text-gray-600 mb-6">The WhatsApp group you're looking for doesn't exist or has been removed.</p>
        <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
        <div className="h-2 bg-primary"></div>
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>
              <div className="flex items-center text-sm text-gray-500 gap-4">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1.5" />
                  <span>{group.members} members</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1.5" />
                  <span>{group.country}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  <span>Created {getTimeAgo(group.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyLink}
                className="flex items-center"
              >
                {isCopied ? <Check className="h-4 w-4 mr-1.5" /> : <Copy className="h-4 w-4 mr-1.5" />}
                {isCopied ? "Copied!" : "Copy Link"}
              </Button>
              <Button onClick={joinGroup} className="flex items-center">
                <ExternalLink className="h-4 w-4 mr-1.5" />
                Join Group
              </Button>
            </div>
          </div>

          <div className="bg-primary/5 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-2">Description</h2>
            <p className="text-gray-700">{group.description}</p>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium capitalize">
              {group.category}
            </div>
            <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
              Added on {formatDate(group.createdAt)}
            </div>
            <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
              Owner: {group.owner}
            </div>
          </div>
          
          <Tabs defaultValue="about">
            <TabsList className="w-full border-b pb-0 mb-6">
              <TabsTrigger value="about" className="text-base">About WhatsApp Groups</TabsTrigger>
              <TabsTrigger value="tips" className="text-base">Usage Tips</TabsTrigger>
              <TabsTrigger value="faq" className="text-base">FAQs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="mt-0">
              <Card className="border-0 shadow-none">
                <CardContent className="p-0 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">What are WhatsApp Groups?</h3>
                    <p className="text-gray-700 leading-relaxed">
                      WhatsApp Groups allow you to message with up to 256 people at once, sharing messages, photos, videos, and documents. Groups are perfect for staying in touch with family, collaborating with coworkers, or organizing events with friends.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Benefits of Joining Groups</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>Connect with like-minded people with similar interests</li>
                      <li>Share information, resources, and knowledge quickly</li>
                      <li>Coordinate activities and events more efficiently</li>
                      <li>Build communities around shared passions or goals</li>
                      <li>Stay updated with the latest news and trends in your area of interest</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tips" className="mt-0">
              <Card className="border-0 shadow-none">
                <CardContent className="p-0 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Tips for Using WhatsApp Groups</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>Introduce yourself when joining a new group</li>
                      <li>Read the group description and follow any posted rules</li>
                      <li>Keep messages relevant to the group's purpose</li>
                      <li>Avoid sending excessive media that may fill other members' storage</li>
                      <li>Use the reply feature to respond to specific messages in busy groups</li>
                      <li>Mute notifications for large groups to avoid constant interruptions</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Group Privacy Settings</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Be aware that your phone number will be visible to all group members. WhatsApp offers privacy settings that let you control who can add you to groups. Go to Settings → Account → Privacy → Groups to adjust these settings.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="faq" className="mt-0">
              <Card className="border-0 shadow-none">
                <CardContent className="p-0 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">How do I join this WhatsApp group?</h3>
                      <p className="text-gray-700">
                        Simply click the "Join Group" button above, which will open the WhatsApp app with the invitation link. Tap "Join Group" in WhatsApp to become a member.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Can I leave a group after joining?</h3>
                      <p className="text-gray-700">
                        Yes, you can leave any WhatsApp group at any time. Open the group, tap the group name at the top, scroll to the bottom and select "Exit Group."
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Will everyone in the group see my phone number?</h3>
                      <p className="text-gray-700">
                        Yes, your phone number will be visible to all members of the group. If you want to maintain privacy, consider using WhatsApp's privacy settings.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">What should I do if a group contains inappropriate content?</h3>
                      <p className="text-gray-700">
                        If you encounter inappropriate content or behavior, you can report the group to WhatsApp. Leave the group, then block and report it through your chat list.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}