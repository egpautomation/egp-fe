// @ts-nocheck
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Eye, MapPin, Building2, DollarSign, Calendar, Loader2, ArrowLeft } from "lucide-react";
import { favoriteService } from "@/lib/favoriteService";
import { AuthContext } from "@/provider/AuthProvider";
import { FavoriteContext } from "@/provider/FavoriteContext";
import { formatDate } from "@/lib/formateDate";

export default function FavoriteTenders() {
  const { isAuthenticated } = useContext(AuthContext);
  const { setReload: setFavoriteReload } = useContext(FavoriteContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await favoriteService.getFavorites();
      setFavorites(res.data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (tenderId) => {
    try {
      await favoriteService.removeFavorite(tenderId);
      setFavorites((prev) => prev.filter((t) => t._id !== tenderId));
      setFavoriteReload((p) => p + 1);
    } catch {
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center -m-5">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 text-sm">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen -m-5 p-5 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Favorite Tenders</h1>
          <p className="text-sm text-slate-500">{favorites.length} টি সেভ করা টেন্ডার</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart className="w-16 h-16 text-slate-200 mb-4" />
          <h2 className="text-lg font-semibold text-slate-600">No favorite tenders yet</h2>
          <p className="text-sm text-slate-400 mt-1">
            টেন্ডার ব্রাউজ করুন এবং হার্ট আইকনে ক্লিক করে সেভ করুন।
          </p>
          <Link to="/dashboard" className="mt-4">
            <Button variant="outline">Browse Tenders</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((tender) => (
            <Card key={tender._id} className="rounded-2xl border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      #{tender.tenderId || "N/A"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {tender.descriptionOfWorks || "No description"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:bg-red-50 shrink-0 -mr-2 -mt-1"
                    onClick={() => handleRemove(tender._id)}
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                  {tender.organization && (
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      <span className="truncate max-w-[140px]">{tender.organization}</span>
                    </span>
                  )}
                  {tender.locationDistrict && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {tender.locationDistrict}
                    </span>
                  )}
                </div>

                {tender.estimatedCost && (
                  <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
                    <DollarSign className="h-4 w-4" />
                    {Number(tender.estimatedCost).toLocaleString("bn-BD")} টাকা
                  </div>
                )}

                {tender.openingDateTime && (
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Calendar className="h-3 w-3" />
                    শেষ তারিখ: {formatDate(tender.openingDateTime, "eee MMM dd yyyy")}
                  </div>
                )}

                <Link to={`/dashboard/view-tender/${tender._id}`}>
                  <Button variant="outline" size="sm" className="w-full mt-1">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
