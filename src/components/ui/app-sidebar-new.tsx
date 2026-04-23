// @ts-nocheck
import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "@/provider/AuthProvider";
import {
  Search,
  BarChart3,
  User,
  AlertCircle,
  Database,
  FileText,
  Briefcase,
  Heart,
  Settings,
  LogOut,
  Menu,
  MenuSquare,
  Code2,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Globe,
  Tag,
  Building2,
  ClipboardList,
  Users,
  ShoppingBag,
  Mail,
  Plus,
  Package,
  FileSpreadsheet,
  Calendar,
  CreditCard as CreditCardIcon,
  Shield,
  FileCheck,
  FileEdit,
  FileSearch,
  FileX,
  FileBarChart,
  FileClock,
  FileSettings,
  FileType,
  FileDigit,
  FileText as FileTextIcon,
  FileCode,
  FileJson,
  FileDatabase,
  FileArchive,
  FileImage,
  FileVideo,
  FileAudio,
  FilePdf,
  FileWord,
  FileExcel,
  FilePowerpoint,
  FileZip,
  FileCog,
  FileHeart,
  FileStar,
  FileMinus,
  FilePlus,
  FileUp,
  FileDown,
  FileLeft,
  FileRight,
  FileX2,
  FileCheck2,
  FileEdit2,
  FileSearch2,
  FileBarChart2,
  FileClock2,
  FileSettings2,
  FileType2,
  FileDigit2,
  FileText2,
  FileCode2,
  FileJson2,
  FileDatabase2,
  FileArchive2,
  FileImage2,
  FileVideo2,
  FileAudio2,
  FilePdf2,
  FileWord2,
  FileExcel2,
  FilePowerpoint2,
  FileZip2,
  FileCog2,
  FileHeart2,
  FileStar2,
  FileMinus2,
  FilePlus2,
  FileUp2,
  FileDown2,
  FileLeft2,
  FileRight2,
  LayoutDashboard,
  X,
  ShoppingCart,
  Bell,
  SquareSigma,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "./input";
import { CartContext } from "@/provider/CartContext";

export function AppSidebarNew() {
  const { JobOrderCount } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const { logout, setUser, user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  const routes = [
    {
      label: "At a Glance",
      path: "/dashboard/at-a-glance",
      role: ["admin", "user", "moderator", "user"],
      icon: BarChart3,
      children: [
        { label: "At a Glance", path: "/dashboard/at-a-glance", role: ["admin", "user", "moderator", "user"] },
      ],
    },
    {
      label: "Live Tender",
      path: "/dashboard/live-tenders-tenderIds",
      role: ["admin", "moderator", "user_agent"],
      icon: BarChart3,
      children: [
        {
          label: "Live Tenders",
          path: "/dashboard/live-tenders-tenderIds?page=1&limit=20",
          role: ["admin", "moderator"],
        },
        {
          label: "Live Tender",
          path: "/dashboard/live-tender",
          role: ["user", "admin", "guest", "moderator", "user_agent"],
        },
        {
          label: "Our Live Tender",
          path: "/dashboard/live-tenders",
          role: ["user", "admin", "guest", "moderator", "user_agent"],
        },
        {
          label: "LTM Tenders",
          path: "/dashboard/tenders/ltm-tenders",
          role: ["user", "admin", "guest", "moderator", "user_agent"],
        },
        {
          label: "Promotional Tender",
          path: "/dashboard/promotional-tender",
          role: ["user", "admin", "guest", "moderator"],
        },
      ],
    },
    {
      label: "LTM Bypass Report",
      path: "/dashboard",
      role: ["admin", "user_agent", "moderator"],
      icon: Briefcase,
      children: [
        {
          label: "Add to LTM Bypass (Single)",
          path: "/dashboard/create-job-order-single",
          role: ["admin", "user_agent", "user", "moderator"],
        },
        {
          label: "Add to LTM Bypass (Bulk)",
          path: "/dashboard/create-job-order-bulk",
          role: ["admin", "user_agent", "user", "moderator"],
        },
      ],
    },
    {
      label: "Tender Preparation",
      path: "/dashboard",
      role: ["admin", "user_agent", "moderator"],
      icon: Briefcase,
      children: [
        {
          label: "Add Tender Preparation",
          path: "/dashboard/tender-preparation",
          role: ["admin", "user_agent", "user", "moderator"],
        },
        {
          label: "STL Calculation",
          path: "/dashboard/stl-calculation",
          role: ["admin", "user_agent", "user", "moderator"],
        },
      ],
    },
    {
      label: "Estimated",
      path: "/",
      role: ["admin", "moderator"],
      icon: SquareSigma,
      children: [
        {
          label: "SOR",
          path: "/dashboard/estimated/sor",
          role: ["admin", "moderator"],
        },
        {
          label: "BOQ",
          path: "/dashboard/estimated/boq",
          role: ["admin", "moderator"],
        },
      ],
    },
    {
      label: "Services",
      path: "/dashboard",
      role: ["guest", "user", "moderator", "admin", "user_agent"],
      icon: Settings,
      children: [
        {
          label: "Egp Listed Company",
          path: "/dashboard/all-egp-listed-company",
          role: ["admin"],
        },
        {
          label: "All Company Registration",
          path: "/dashboard/company-registration",
          role: ["admin"],
        },
        {
          label: "My Registered Company",
          path: "/dashboard/my-registered-company",
          role: ["guest", "user", "moderator", "admin", "user_agent"],
        },
        {
          label: "My LTM Bypass Reports",
          path: "/dashboard/job-order/me",
          role: ["guest", "user", "moderator", "admin", "user_agent"],
        },
        {
          label: "All LTM Bypass Reports",
          path: "/dashboard/job-order",
          role: ["admin"],
        },
        {
          label: "Update LTM Status",
          path: "/public/job-order/update-status",
          role: ["admin", "user", "moderator", "guest"],
        },
        {
          label: "OTM Update Status",
          path: "/public/otm-update-status",
          role: ["admin", "moderator"],
        },
        {
          label: "OTM Bypass Status",
          path: "/dashboard/otm-bypass-status",
          role: ["admin"],
        },
        {
          label: "Egp Pass Email",
          path: "/dashboard/egp-pass-email",
          role: ["admin", "user_agent"],
        },
        {
          label: "Add A Service",
          path: "/dashboard/create-service",
          role: ["admin"],
        },
        {
          label: "ALL Services",
          path: "/dashboard/services",
          role: "admin",
        },
        {
          label: "ALL Users",
          path: "/dashboard/users",
          role: "admin",
        },
        {
          label: "Users details",
          path: "/dashboard/services",
          role: "admin",
        },
        {
          label: "Orders",
          path: "/dashboard/services",
          role: "admin",
        },
        {
          label: "order details",
          path: "/dashboard/services",
          role: "admin",
        },
        {
          label: "Refund",
          path: "/dashboard/services",
          role: "admin",
        },
        {
          label: "All Software",
          path: "/dashboard/services",
          role: "user",
        },
        {
          label: "Cart",
          path: "/dashboard/jobOrder-cart",
          role: ["guest", "user"],
        },
        {
          label: "Checkout",
          path: "/dashboard/services",
          role: "user",
        },
        {
          label: "Order Tracking",
          path: "/dashboard/services",
          role: "user",
        },
        {
          label: "Invoice",
          path: "/dashboard/services",
          role: "user",
        },
        {
          label: "Billing Details",
          path: "/dashboard/services",
          role: "user",
        },
        {
          label: "Promo Codes",
          path: "/dashboard/promo-codes",
          role: ["admin"],
        },
        {
          label: "Profile",
          path: "/dashboard/services",
          role: "user",
        },
        {
          label: "Support (App Ticket)",
          path: "/dashboard/services",
          role: "user",
        },
        {
          label: "All Departments",
          path: "/dashboard/departments",
          role: ["admin"],
        },
        {
          label: "Update Tender(secondary)",
          path: "/dashboard/update-secondary-tender",
          role: ["admin"],
        },
        {
          label: "Create Payment",
          path: "/dashboard/create-payment",
          role: ["admin"],
        },
        {
          label: "Payment",
          path: "/dashboard/payment",
          role: ["admin", "user_agent"],
        },
      ],
    },
    {
      label: "Service(Bank)",
      path: "/dashboard",
      role: ["guest", "user", "moderator", "admin"],
      icon: CreditCard,
      children: [
        {
          label: "Line Of Credit",
          path: "/dashboard/bankService/line-of-credit",
          role: ["guest", "user", "moderator", "admin"],
        },
        {
          label: "Bank Details",
          path: "/dashboard/bankService/bank-details",
          role: ["guest", "user", "moderator", "admin"],
        },
        {
          label: "My All Accounts",
          path: "/dashboard/bankService/user-accounts",
          role: ["guest", "user", "moderator", "admin"],
        },
        {
          label: "Account Holder Details",
          path: "/dashboard/bankService/account-holder-details",
          role: ["guest", "user", "moderator", "admin"],
        },
      ],
    },
    {
      label: "Bypass Report",
      path: "/dashboard",
      role: ["guest", "user", "moderator", "admin"],
      icon: FileSearch,
      children: [
        {
          label: "Bypass Report",
          path: "/public/by-pass-report",
          role: ["guest", "user", "moderator", "admin"],
        },
        {
          label: "OTM Bypass Report",
          path: "/public/ltm-by-pass-report",
          role: ["guest", "user", "moderator", "admin"],
        },
      ],
    },
    {
      label: "Data Entry",
      path: "/dashboard/tender-data-entry",
      role: ["admin"],
      icon: Database,
      children: [
        {
          label: "Tender Ids",
          path: "/dashboard/tender-tenderIds",
          role: ["admin"],
        },
        // {
        //   label: "Tenders (Need To Update)",
        //   path: "/dashboard/tender-categoryNull",
        //   role: ["admin"],
        // },
      ],
    },
    {
      label: "Data Entry (ALL)",
      path: "/dashboard/tender-data-entry",
      role: ["admin"],
      icon: FileText,
      children: [
        {
          label: "(ALL) Tender Data Entry",
          path: "/dashboard/tender-data-entry",
          role: ["guest", "user", "moderator", "admin"],
        },
        {
          label: "(ALL) Update Data Entry",
          path: "/dashboard/update-tender-data-entry",
          role: ["guest", "user", "moderator", "admin"],
        },
      ],
    },
    {
      label: "Data Entry (TTI)",
      path: "/public/tender-data-entry-tti",
      role: ["admin", "tti_agent"],
      icon: FileText,
      children: [
        {
          label: "Data Entry",
          path: "/dashboard/tender-data-entry-tti",
          role: ["admin", "tti_agent"],
        },
        {
          label: "Null Category Tender",
          path: "/dashboard/tender-categoryNull",
          role: ["admin", "tti_agent"],
        },
        {
          label: "Skipped Tender",
          path: "/dashboard/tender-skipped",
          role: ["admin", "tti_agent"],
        },
      ],
    },
    {
      label: "Public Routes",
      path: "/dashboard/tender-data-entry",
      role: ["guest", "user", "moderator", "admin"],
      icon: Globe,
      children: [
        {
          label: "Create Tender",
          path: "/public/create-tender",
          role: ["guest", "user", "moderator", "admin"],
        },
        {
          label: "Update Tender",
          path: "/public/update-tender-secondary",
          role: ["guest", "user", "moderator", "admin"],
        },
        // {
        //   label: "Null Category Tender",
        //   path: "/public/tender-categoryNull",
        //   role: ["guest", "user", "moderator", "admin"],
        // },
        {
          label: "Tender Ids",
          path: "/public/tender-tenderIds",
          role: ["guest", "user", "moderator", "admin"],
        },
        {
          label: "Tender Ids (OTM)",
          path: "/public/tender-tenderIds-otm",
          role: ["guest", "user", "moderator", "admin"],
        },
        {
          label: "Tender Ids (LTM)",
          path: "/public/tender-tenderIds-ltm",
          role: ["guest", "user", "moderator", "admin"],
        },
        {
          label: "Tender Ids (OSTETM)",
          path: "/public/tender-tenderIds-ostetm",
          role: ["guest", "user", "moderator", "admin"],
        },
        // {
        //   label: "Tender Data Entry (TTI)",
        //   path: "/public/tender-data-entry-tti",
        //   role: ["guest", "user", "moderator", "admin"],
        // },
        {
          label: "Tender Categories",
          path: "/public/tenders/tender-categories",
          role: ["guest", "user", "moderator", "admin"],
        },
      ],
    },
    {
      label: "Public Routes (TenderId)",
      path: "/dashboard/tender-data-entry",
      role: ["guest", "user", "moderator", "admin"],
      icon: Tag,
      children: [
        {
          label: "Tender Ids",
          path: "/public/tender-tenderIds",
          role: ["guest", "user", "moderator", "admin"],
        },
        {
          label: "Tender Ids (OTM)",
          path: "/public/tender-tenderIds-otm",
          role: ["guest", "user", "moderator", "admin"],
        },
        {
          label: "Tender Ids (LTM)",
          path: "/public/tender-tenderIds-ltm",
          role: ["guest", "user", "moderator", "admin"],
        },
        {
          label: "Tender Ids (OSTETM)",
          path: "/public/tender-tenderIds-ostetm",
          role: ["guest", "user", "moderator", "admin"],
        },
      ],
    },
  ];

  return (
    <div>
      {/* Mobile backdrop overlay - click outside to close */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-transparent z-40"
        />
      )}

      {/* mobile menu */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-3.5 left-3.5 z-50 bg-gray-100 p-2 rounded-full"
      >
        {isOpen ? <X /> : <Menu />}
      </div>
      {/* empty space for desktop menu */}
      <div
        className={`${isOpen ? "w-64" : "w-16"
          } max-md:hidden transition-all duration-500 ease-in-out`}
      ></div>

      {/* desktop menu */}
      <motion.div
        className={`fixed left-0 top-0 h-full bg-white border-r z-50 transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? "w-64" : "w-16 max-md:w-0"
          }`}
        onMouseEnter={() => window.innerWidth >= 768 && setIsOpen(true)}
        onMouseLeave={() => window.innerWidth >= 768 && setIsOpen(false)}
      >
        <div className="px-2 py-2">
          {/* Logo Details */}
          <div className="h-15 flex items-center relative">
            <span className="text-black text-xl font-semibold text-nowrap">
              {isOpen ? (
                <div>
                  {/* search bar */}
                  <motion.div
                    className={`relative mt-4 px-2 ${isOpen ? "block" : "hidden"}`}
                  // initial={{ opacity: 0, y: -20 }}
                  // animate={{ opacity: 1, y: 0 }}
                  // transition={{ duration: 0.3, delay: 2 }}
                  >
                    <Input
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search size={16} className="absolute top-2.5 right-2" />
                  </motion.div>
                </div>
              ) : (
                <div className="h-max w-max absolute top-5 right-1 p-3 rounded-full bg-gray-100">
                  <Search size={16} className="" />
                </div>
              )}
            </span>
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden absolute top-3.5 left-48 z-50 bg-gray-100 p-2 rounded-full"
            >
              <X />
            </div>
          </div>

          {/* Navigation List */}
          <ul className="flex flex-col mt-4  ">
            <div className="max-h-[calc(100vh-250px)] md:max-h-[calc(100vh-150px)] overflow-y-scroll overflow-x-hidden pr-4 pb-8 [&::-webkit-scrollbar]:w-[2px]  [&::-webkit-scrollbar-thumb]:bg-gray-500">
              {/* Home Link */}
              <motion.li
                className="relative mb-2 group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0 }}
              >
                <div className="w-full">
                  <motion.div
                    className={`flex h-12 w-full rounded-xl items-center justify-between text-decoration-none ${location.pathname === "/" ? "" : " hover:bg-gray-100"
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link to="/" className="flex gap-2 items-center w-full">
                      <motion.div
                        className="bg-gray-100 rounded-full p-2"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <LayoutDashboard className="text-black text-lg h-6 w-6 flex items-center justify-center rounded-xl" />
                      </motion.div>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.3 }}
                            className="text-black text-sm font-normal whitespace-nowrap"
                          >
                            Dashboard
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  </motion.div>
                </div>

                {/* {!isOpen && (
                <motion.span
                  className="absolute top-[-20px] left-[calc(100%+15px)] z-30 bg-white shadow-lg px-3 py-1.5 rounded text-sm font-normal pointer-events-none"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  Home
                </motion.span>
              )} */}
              </motion.li>

              {/* Navigation Items */}
              {routes?.map((route, idx) => {
                const IconComponent = route.icon || null;
                const isActive = location.pathname === route.path;
                const hasAccess =
                  user?.role === "admin" || !route?.role || route?.role.includes(user?.role);

                if (!hasAccess) return null;

                // Search Logic
                const labelMatches = route.label.toLowerCase().includes(searchQuery.toLowerCase());
                const matchingChildren = route.children?.some((child) =>
                  child.label.toLowerCase().includes(searchQuery.toLowerCase())
                );

                // If searching and neither label nor children match, hide this item
                if (searchQuery.trim() !== "" && !labelMatches && !matchingChildren) {
                  return null;
                }

                // Auto-expand if searching and children match
                const isSearching = searchQuery.trim() !== "";
                const forceExpand = isSearching && matchingChildren;
                const isExpanded = isOpen && (openIndex === idx || forceExpand);

                return (
                  <motion.div
                    key={idx}
                    className="relative mb-2 group "
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                  >
                    <div className="w-full ">
                      <motion.button
                        onClick={() => {
                          if (route.children) {
                            setOpenIndex(openIndex === idx ? null : idx);
                          }
                        }}
                        className={`flex h-12 w-full group transition-all duration-200 rounded-xl items-center justify-between text-decoration-none ${isActive ? "" : " hover:text-[#4874c7] hover:bg-blue-50"
                          }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="flex gap-2 items-center">
                          <motion.div
                            className="bg-gray-100 group-hover:bg-blue-100 rounded-full p-2"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <IconComponent className="text-black  group-hover:text-[#4874c7] text-lg h-6 w-6 flex items-center justify-center rounded-xl" />
                          </motion.div>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.3 }}
                                className="text-black text-sm group-hover:text-[#4874c7] font-normal whitespace-nowrap"
                              >
                                {route.label}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                        {route.children && isOpen && (
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="text-black text-lg" />
                          </motion.div>
                        )}
                      </motion.button>

                      {/* Child Routes */}
                      <AnimatePresence>
                        {route.children && isExpanded && (
                          <motion.div
                            className="ml-4 mt-2 space-y-1"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            {route.children
                              ?.filter(
                                (item) => item?.role.includes(user?.role) || user?.role === "admin"
                              )
                              .filter((item) => {
                                // Filter children: Show if search is empty, OR child matches, OR parent matches
                                if (!isSearching) return true;
                                return (
                                  item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  labelMatches
                                );
                              })
                              .map((item, childIdx) => {
                                const childIsActive = location.pathname === item.path;
                                return (
                                  <motion.div
                                    key={childIdx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                      duration: 0.2,
                                      delay: childIdx * 0.1,
                                    }}
                                  >
                                    <Link
                                      to={item.path}
                                      className={`flex h-10 w-full rounded-lg items-center px-4 transition-all duration-200 ${childIsActive
                                        ? "bg-black text-white"
                                        : "text-black hover:bg-gray-100"
                                        }`}
                                    >
                                      {/* <div className="w-2 h-2 bg-current rounded-full opacity-60 mr-3"></div> */}
                                      <div className="text-sm min-w-fit text-nowrap flex items-center justify-center">
                                        <div className="w-2 h-2 bg-current rounded-full opacity-60 mr-3"></div>
                                        <span>{item.label}</span>
                                      </div>
                                    </Link>
                                  </motion.div>
                                );
                              })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {!isOpen && (
                      <motion.span
                        className="absolute top-[-20px] left-[calc(100%+15px)] z-30 bg-white shadow-lg px-3 py-1.5 rounded text-sm font-normal pointer-events-none"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {route.label}
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Logout Button */}
            <motion.li
              className="relative mb-2 group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: routes.length * 0.1 }}
            >
              <div className="w-full">
                <motion.button
                  onClick={handleLogout}
                  className="flex h-12 w-full rounded-xl items-center justify-between text-decoration-none hover:bg-red-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex gap-2 items-center">
                    <motion.div
                      className="bg-red-200 rounded-full p-2"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <LogOut className="text-black text-lg h-6 w-6 flex items-center justify-center rounded-xl" />
                    </motion.div>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.3 }}
                          className="text-left"
                        >
                          <span>Logout</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              </div>

              {!isOpen && (
                <motion.span
                  className="absolute top-[-20px] left-[calc(100%+15px)] z-30 bg-white shadow-lg px-3 py-1.5 rounded text-sm font-normal pointer-events-none"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  Logout
                </motion.span>
              )}
            </motion.li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

