// @ts-nocheck
import { useContext, useEffect, useState } from "react";
import { NotificationContext } from "@/provider/NotificationContext";
import axiosInstance from "@/lib/axiosInstance";
import { formatDate } from "@/lib/formateDate";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, MapPin, Building2, Layers, Trash2, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const matchTypeConfig = {
  district: { icon: MapPin, label: "District", color: "bg-blue-100 text-blue-700 border-blue-200" },
  department: { icon: Building2, label: "Department", color: "bg-green-100 text-green-700 border-green-200" },
  category: { icon: Layers, label: "Category", color: "bg-purple-100 text-purple-700 border-purple-200" },
};

const NotificationCard = ({ notification, onMarkRead, onDelete }) => {
  const config = matchTypeConfig[notification.matchType] || matchTypeConfig.district;
  const Icon = config.icon;
  const tender = notification.tender || {};

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md",
        !notification.isRead && "border-l-4 border-l-primary bg-primary/[0.02]"
      )}
    >
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className={cn("p-2 rounded-full h-fit", config.color.split(" ")[0])}>
            <Icon className={cn("h-4 w-4", config.color.split(" ")[1])} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <Link
                  to={`/dashboard/view-tender/${tender._id}`}
                  className="text-sm font-medium text-slate-800 hover:text-primary line-clamp-2"
                >
                  {tender.descriptionOfWorks || "Tender Notification"}
                </Link>
                {tender.organization && (
                  <p className="text-xs text-slate-500 mt-0.5">{tender.organization}</p>
                )}
              </div>
              <Badge variant="outline" className={cn("text-[10px] shrink-0", config.color)}>
                {config.label}: {notification.matchValue}
              </Badge>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-[11px] text-slate-400">
                {formatDate(notification.createdAt, "dd MMM, yyyy hh:mm a")}
              </p>
              <div className="flex gap-1">
                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => onMarkRead(notification._id)}
                  >
                    <Check className="h-3 w-3 mr-1" /> Read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-red-500 hover:text-red-600"
                  onClick={() => onDelete(notification._id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const NotificationList = ({ matchType }: { matchType?: string }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const { markAsRead, deleteNotification, refreshUnreadCount } =
    useContext(NotificationContext) as any;

  const fetchNotifications = async (p = 1) => {
    try {
      setLoading(true);
      const params: any = { page: p, limit: 20 };
      if (matchType) params.matchType = matchType;
      const res = await axiosInstance.get("/notifications", { params });
      if (res.data?.success) {
        setNotifications(res.data.data);
        setTotal(res.data.total);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(page);
  }, [matchType, page]);

  const handleMarkRead = async (id: string) => {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n: any) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n: any) => n._id !== id));
    refreshUnreadCount();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-primary w-6 h-6" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500">
        <Bell className="h-10 w-10 mx-auto mb-2 opacity-30" />
        <p className="text-sm">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification: any) => (
        <NotificationCard
          key={notification._id}
          notification={notification}
          onMarkRead={handleMarkRead}
          onDelete={handleDelete}
        />
      ))}
      {total > 20 && (
        <div className="flex justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-slate-500 flex items-center">
            Page {page} of {Math.ceil(total / 20)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= Math.ceil(total / 20)}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

const Notifications = () => {
  const { markAllAsRead, unreadCount } = useContext(NotificationContext) as any;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-slate-500 mt-1">
              {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-1" /> Mark All Read
          </Button>
        )}
      </div>

      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="district" className="gap-1">
            <MapPin className="h-3 w-3" /> District
          </TabsTrigger>
          <TabsTrigger value="department" className="gap-1">
            <Building2 className="h-3 w-3" /> Department
          </TabsTrigger>
          <TabsTrigger value="category" className="gap-1">
            <Layers className="h-3 w-3" /> Category
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <NotificationList />
        </TabsContent>
        <TabsContent value="district" className="mt-4">
          <NotificationList matchType="district" />
        </TabsContent>
        <TabsContent value="department" className="mt-4">
          <NotificationList matchType="department" />
        </TabsContent>
        <TabsContent value="category" className="mt-4">
          <NotificationList matchType="category" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
