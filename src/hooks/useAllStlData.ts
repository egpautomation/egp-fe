// @ts-nocheck

import config from "@/lib/config";
import { useState, useCallback, useEffect, useRef } from "react";

const ITEMS_PER_PAGE = 20;

const useAllStlData = () => {
  const [stlData, setStlData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filters
  const [districtFilter, setDistrictFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter options (districts & organizations)
  const [districtOptions, setDistrictOptions] = useState<string[]>([]);
  const [orgOptions, setOrgOptions] = useState<string[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);

  // Debounce timer ref
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch filter options once
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setOptionsLoading(true);
        const response = await fetch(`${config.apiBaseUrl}/stl/filter-options`);
        const data = await response.json();
        if (data?.success) {
          setDistrictOptions(data.data.districts || []);
          setOrgOptions(data.data.organizations || []);
        }
      } catch (error) {
        console.error("Error fetching filter options:", error);
      } finally {
        setOptionsLoading(false);
      }
    };
    fetchOptions();
  }, []);

  // Fetch paginated data
  const fetchData = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: String(page),
          limit: String(ITEMS_PER_PAGE),
        });
        if (districtFilter && districtFilter !== "all") {
          params.set("district", districtFilter);
        }
        if (departmentFilter && departmentFilter !== "all") {
          params.set("organization", departmentFilter);
        }
        if (searchQuery.trim()) {
          params.set("search", searchQuery.trim());
        }

        const response = await fetch(`${config.apiBaseUrl}/stl/all?${params}`);
        const data = await response.json();
        setStlData(data?.data || []);
        setTotalCount(data?.totalCount || 0);
        setTotalPages(data?.totalPages || 1);
        setCurrentPage(page);
      } catch (error) {
        console.error("Error fetching STL data:", error);
      } finally {
        setLoading(false);
      }
    },
    [districtFilter, departmentFilter, searchQuery],
  );

  // Refetch when filters change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Debounce search, immediate for filters
    const delay = searchQuery ? 400 : 0;
    debounceRef.current = setTimeout(() => {
      fetchData(1);
    }, delay);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [districtFilter, departmentFilter, searchQuery, fetchData]);

  return {
    stlData,
    totalCount,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
    // Filters
    districtFilter,
    setDistrictFilter,
    departmentFilter,
    setDepartmentFilter,
    searchQuery,
    setSearchQuery,
    // Filter options
    districtOptions,
    orgOptions,
    optionsLoading,
    // Manual refetch
    refetch: fetchData,
  };
};

export default useAllStlData;
