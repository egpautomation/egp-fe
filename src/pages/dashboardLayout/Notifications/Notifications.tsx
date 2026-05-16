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
import {
  Bell,
  MapPin,
  Building2,
  Layers,
  Trash2,
  Check,
  Loader2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
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
  const isUnread = !notification.isRead;

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all",
        isUnread
          ? "border-primary/25 bg-[#f5f8ff] shadow-sm hover:shadow-md"
          : "border-slate-200 bg-white/90 hover:border-slate-300 hover:shadow-sm"
      )}
    >
      <div className={cn("absolute inset-y-0 left-0 w-1", isUnread ? "bg-primary" : "bg-slate-200")} />
      <CardContent className="p-3.5 sm:p-4">
        <div className="flex gap-3">
          <div
            className={cn(
              "p-2 rounded-full h-fit border shrink-0",
              isUnread
                ? "bg-white border-primary/15 shadow-sm"
                : "bg-slate-50 border-slate-200 opacity-75"
            )}
          >
            <Icon className={cn("h-4 w-4", config.color.split(" ")[1])} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1 min-w-0">
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full shrink-0",
                      isUnread ? "bg-primary" : "bg-slate-300"
                    )}
                  />
                  <Badge
                    variant="outline"
                    className={cn(
                      "h-5 rounded-full px-2 text-[10px]",
                      isUnread
                        ? "border-primary/25 bg-white text-primary"
                        : "border-slate-200 bg-slate-50 text-slate-500"
                    )}
                  >
                    {isUnread ? "Unread" : "Read"}
                  </Badge>
                </div>
                <Link
                  to={`/dashboard/view-tender/${tender._id}`}
                  className={cn(
                    "block text-sm font-semibold leading-5 hover:text-primary line-clamp-2 break-words",
                    isUnread ? "text-slate-950" : "text-slate-700"
                  )}
                >
                  {tender.descriptionOfWorks || "Tender Notification"}
                </Link>
                {tender.organization && (
                  <p
                    className={cn(
                      "mt-1 line-clamp-1 text-xs break-words",
                      isUnread ? "text-slate-600" : "text-slate-400"
                    )}
                  >
                    {tender.organization}
                  </p>
                )}
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "w-fit max-w-full shrink-0 whitespace-normal break-words text-left text-[10px] leading-4 sm:max-w-[220px]",
                  isUnread ? config.color : "border-slate-200 bg-slate-50 text-slate-500"
                )}
              >
                {config.label}: {notification.matchValue}
              </Badge>
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className={cn("text-[11px]", isUnread ? "text-slate-500" : "text-slate-400")}>
                {formatDate(notification.createdAt, "dd MMM, yyyy hh:mm a")}
              </p>
              <div className="flex flex-wrap gap-1">
                {isUnread ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-md border-[#4874c7]/25 bg-white px-3 text-xs text-[#4874c7] hover:border-[#4874c7] hover:bg-[#4874c7] hover:text-white focus-visible:border-[#4874c7] focus-visible:ring-[#4874c7]/25 sm:h-7"
                    onClick={() => onMarkRead(notification._id)}
                  >
                    <Check className="h-3 w-3 mr-1" /> Mark read
                  </Button>
                ) : (
                  <span className="inline-flex h-7 items-center gap-1 px-2 text-xs text-slate-400">
                    <Check className="h-3 w-3" /> Read
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs text-red-500 hover:text-red-600 sm:h-7"
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

const groupNotifications = (notifications: any[]) => {
  const groups = new Map();

  for (const notification of notifications) {
    const key = notification.matchValue || "Unknown";
    const existing = groups.get(key) || {
      value: key,
      notifications: [],
      unreadCount: 0,
      latestAt: notification.createdAt,
    };

    existing.notifications.push(notification);
    if (!notification.isRead) existing.unreadCount += 1;
    if (new Date(notification.createdAt) > new Date(existing.latestAt)) {
      existing.latestAt = notification.createdAt;
    }

    groups.set(key, existing);
  }

  return Array.from(groups.values()).sort((a, b) => {
    if (b.unreadCount !== a.unreadCount) return b.unreadCount - a.unreadCount;
    return new Date(b.latestAt).getTime() - new Date(a.latestAt).getTime();
  });
};

const NotificationGroup = ({
  group,
  matchType,
  isOpen,
  onToggle,
  onMarkRead,
  onDelete,
}) => {
  const config = matchTypeConfig[matchType] || matchTypeConfig.district;
  const Icon = config.icon;
  const hasUnread = group.unreadCount > 0;

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all",
        hasUnread
          ? "border-primary/25 bg-[#f7f9ff] shadow-sm hover:shadow-md"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "w-full text-left px-3 py-3 transition-colors sm:px-4",
          hasUnread ? "hover:bg-white/60" : "hover:bg-slate-50"
        )}
      >
        <div className="flex items-start gap-2 sm:items-center sm:gap-3">
          <div
            className={cn(
              "p-2 rounded-full border shrink-0",
              hasUnread
                ? "bg-white border-primary/15 shadow-sm"
                : "bg-slate-50 border-slate-200 opacity-75"
            )}
          >
            <Icon className={cn("h-4 w-4", config.color.split(" ")[1])} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 min-w-0 sm:gap-2">
              <span
                className={cn(
                  "h-2 w-2 rounded-full shrink-0",
                  hasUnread ? "bg-primary" : "bg-slate-300"
                )}
              />
              <p
                className={cn(
                  "min-w-0 max-w-full break-words text-sm sm:truncate sm:text-base",
                  hasUnread ? "font-bold text-slate-900" : "font-semibold text-slate-600"
                )}
              >
                {group.value}
              </p>
              {hasUnread ? (
                <Badge className="bg-primary text-white shrink-0 rounded-full text-[10px] sm:text-xs">
                  {group.unreadCount} unread
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="rounded-full border-slate-200 bg-slate-50 text-slate-500 shrink-0 text-[10px] sm:text-xs"
                >
                  all read
                </Badge>
              )}
            </div>
            <p className={cn("mt-1 text-[11px] leading-4 sm:text-xs", hasUnread ? "text-slate-600" : "text-slate-400")}>
              {group.notifications.length} notification
              {group.notifications.length === 1 ? "" : "s"} · Latest{" "}
              {formatDate(group.latestAt, "dd MMM, yyyy hh:mm a")}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 sm:gap-2">
            <Badge
              variant="outline"
              className={cn(
                "hidden text-[10px] sm:inline-flex",
                hasUnread ? config.color : "border-slate-200 bg-slate-50 text-slate-500"
              )}
            >
              {config.label}
            </Badge>
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-400" />
            )}
          </div>
        </div>
      </button>

      {isOpen && (
        <CardContent
          className={cn(
            "border-t p-3",
            hasUnread ? "border-primary/10 bg-white/65" : "bg-slate-50/60"
          )}
        >
          <div className="space-y-3">
            {group.notifications.map((notification: any) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                onMarkRead={onMarkRead}
                onDelete={onDelete}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

const NotificationList = ({
  matchType,
  grouped = false,
}: {
  matchType?: string;
  grouped?: boolean;
}) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const { markAsRead, deleteNotification, refreshUnreadCount } =
    useContext(NotificationContext) as any;

  const fetchNotifications = async (p = 1) => {
    try {
      setLoading(true);
      const params: any = { page: p, limit: grouped ? 200 : 20 };
      if (matchType) params.matchType = matchType;
      const res = await axiosInstance.get("/notifications", { params });
      if (res.data?.success) {
        setNotifications(res.data.data);
        setTotal(res.data.total);
        setOpenGroups({});
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

  const groups = grouped ? groupNotifications(notifications) : [];
  const pageSize = grouped ? 200 : 20;

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
      {grouped
        ? groups.map((group: any) => (
            <NotificationGroup
              key={group.value}
              group={group}
              matchType={matchType}
              isOpen={!!openGroups[group.value]}
              onToggle={() =>
                setOpenGroups((prev) => ({ ...prev, [group.value]: !prev[group.value] }))
              }
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          ))
        : notifications.map((notification: any) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          ))}
      {total > pageSize && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="flex min-w-full items-center justify-center text-sm text-slate-500 sm:min-w-0">
            Page {page} of {Math.ceil(total / pageSize)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= Math.ceil(total / pageSize)}
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
    <div className="mx-auto w-full max-w-4xl px-0 py-3 sm:px-4 md:p-8">
      <div className="mb-4 flex flex-col gap-3 border-b pb-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:pb-2">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold leading-tight text-slate-800 sm:text-3xl">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-slate-500 mt-1">
              {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" className="w-full justify-center sm:w-auto" onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-1" /> Mark All Read
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="gap-4">
        <div className="-mx-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TabsList className="flex !h-10 min-w-max w-full justify-start gap-1 p-1 sm:min-w-0">
          <TabsTrigger value="all" className="h-8 min-w-20 flex-none px-4 text-xs sm:flex-1 sm:text-sm">All</TabsTrigger>
          <TabsTrigger value="district" className="h-8 min-w-28 flex-none gap-1 px-4 text-xs sm:flex-1 sm:text-sm">
            <MapPin className="h-3 w-3" /> District
          </TabsTrigger>
          <TabsTrigger value="department" className="h-8 min-w-32 flex-none gap-1 px-4 text-xs sm:flex-1 sm:text-sm">
            <Building2 className="h-3 w-3" /> Department
          </TabsTrigger>
          <TabsTrigger value="category" className="h-8 min-w-28 flex-none gap-1 px-4 text-xs sm:flex-1 sm:text-sm">
            <Layers className="h-3 w-3" /> Category
          </TabsTrigger>
        </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <NotificationList />
        </TabsContent>
        <TabsContent value="district" className="mt-0">
          <NotificationList matchType="district" grouped />
        </TabsContent>
        <TabsContent value="department" className="mt-0">
          <NotificationList matchType="department" grouped />
        </TabsContent>
        <TabsContent value="category" className="mt-0">
          <NotificationList matchType="category" grouped />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
