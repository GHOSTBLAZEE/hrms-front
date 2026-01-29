import { useState } from "react";
import { Settings, Bell, Mail, MessageSquare, Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

export default function NotificationSettings() {
  const qc = useQueryClient();

  // Fetch current preferences
  const { data: preferences, isLoading } = useQuery({
    queryKey: ["notification-preferences"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/notifications/preferences");
      return res.data;
    },
  });

  // Update preferences mutation
  const updatePreferences = useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.put("/api/v1/notifications/preferences", data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notification-preferences"] });
      toast.success("Notification preferences updated");
    },
    onError: () => {
      toast.error("Failed to update preferences");
    },
  });

  const [localPreferences, setLocalPreferences] = useState(preferences || {});

  const handleToggle = (key) => {
    const updated = {
      ...localPreferences,
      [key]: !localPreferences[key],
    };
    setLocalPreferences(updated);
    updatePreferences.mutate(updated);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const preferenceCategories = [
    {
      title: "In-App Notifications",
      icon: Bell,
      preferences: [
        {
          key: "in_app_mentions",
          label: "Mentions",
          description: "Get notified when someone mentions you",
        },
        {
          key: "in_app_comments",
          label: "Comments",
          description: "Get notified about new comments on your content",
        },
        {
          key: "in_app_updates",
          label: "Updates",
          description: "Get notified about system updates and changes",
        },
      ],
    },
    {
      title: "Email Notifications",
      icon: Mail,
      preferences: [
        {
          key: "email_mentions",
          label: "Mentions",
          description: "Receive emails when someone mentions you",
        },
        {
          key: "email_digest",
          label: "Daily Digest",
          description: "Receive a daily summary of your notifications",
        },
        {
          key: "email_marketing",
          label: "Marketing",
          description: "Receive updates about new features and tips",
        },
      ],
    },
    {
      title: "Push Notifications",
      icon: MessageSquare,
      preferences: [
        {
          key: "push_mentions",
          label: "Mentions",
          description: "Get push notifications for mentions",
        },
        {
          key: "push_messages",
          label: "Direct Messages",
          description: "Get push notifications for new messages",
        },
      ],
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-semibold">Notification Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage how you receive notifications
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {preferenceCategories.map((category) => (
          <div
            key={category.title}
            className="rounded-lg border bg-card p-6 space-y-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <category.icon className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">{category.title}</h2>
            </div>

            <div className="space-y-4">
              {category.preferences.map((pref) => (
                <div
                  key={pref.key}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{pref.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {pref.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggle(pref.key)}
                    disabled={updatePreferences.isPending}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${
                        localPreferences[pref.key]
                          ? "bg-primary"
                          : "bg-muted"
                      }
                    `}
                    role="switch"
                    aria-checked={localPreferences[pref.key]}
                    aria-label={`Toggle ${pref.label}`}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${
                          localPreferences[pref.key]
                            ? "translate-x-6"
                            : "translate-x-1"
                        }
                      `}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}