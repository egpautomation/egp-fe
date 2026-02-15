// @ts-nocheck
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import { House, Minus, SquareMinus, SquarePlus } from "lucide-react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/provider/AuthProvider";
import { Button } from "./button";

export function AppSidebar() {
  const [openIndex, setOpenIndex] = useState(null);
  const { logout, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const routes = [
    // {
    //   label: "How to do What?",
    //   path: "/dashboard",
    //   role: ["guest"],
    // },
    // {
    //   label: "Notifications",
    //   path: "/dashboard",
    //   role: ["guest"],
    // },
    // {
    //   label: "Coming-soon",
    //   path: "/dashboard",
    //   role: ["guest"],
    // },
    {
      label: "At a Glance",
      path: "/dashboard",
      role: ["admin", "user_agent", "user", "moderator", "user"],
      children: [{ label: "At a Glance", path: "/dashboard", role: ["admin"] }],
    },
    {
      label: "Job Order",
      path: "/dashboard",
      role: ["admin","user_agent"],
      children: [{
          label: "Create Job Order(BulK)",
          path: "/dashboard/create-job-order-bulk",
          role: ["admin","user_agent","user","moderator"],
        },],
    },
    {
      label: "Services",
      path: "/dashboard",
      role: ["guest", "user", "moderator", "admin","user_agent"],
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
          label: "My Job Order",
          path: "/dashboard/job-order/me",
          role: ["guest", "user", "moderator", "admin","user_agent"],
        },
        {
          label: "All Job Order",
          path: "/dashboard/job-order",
          role: ["admin"],
        },
        {
          label: "Update Job Order",
          path: "/public/job-order/update-status",
          role: ["admin","user","moderator", "guest"],
        },
        
        {
          label: "Egp Pass Email",
          path: "/dashboard/egp-pass-email",
          role: ["admin","user_agent"],
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
          label: "All Live Tender",
          path: "/dashboard/live-tenders",
          role: ["user", "admin", "guest", "moderator","user_agent"],
        },
        {
          label: "LTM Tenders",
          path: "/dashboard/tenders/ltm-tenders",
          role: ["user", "admin", "guest", "moderator","user_agent"],
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
          role: ["admin",],
        },
        {
          label: "Payment",
          path: "/dashboard/payment",
          role: ["admin","user_agent"],
        },
        // {
        //   label: "Upload File",
        //   path: "/dashboard/upload-file",
        //   role: ["admin"],
        // },
      ],
    },
    {
      label: "Service(Bank)",
      path: "/dashboard",
      role: ["guest", "user", "moderator", "admin"],
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
    // {
    //   label: "Work Management",
    //   path: "/dashboard/services",
    //   role: ["admin"],
    //   children: [
    //     {
    //       label: "List of Works",
    //       path: "/dashboard/services",
    //       role: "admin",
    //     },
    //     {
    //       label: "To do List",
    //       path: "/dashboard/services",
    //       role: "admin",
    //     },
    //   ],
    // },
    // {
    //   label: "Management Dashboard",
    //   path: "/dashboard/services",
    //   role: ["admin"],
    //   children: [
    //     {
    //       label: "Payment Dashboard",
    //       path: "/dashboard/services",
    //       role: ["admin"],
    //     },
    //     {
    //       label: "support-desk",
    //       path: "/dashboard/services",
    //       role: "admin",
    //     },
    //     {
    //       label: "ticket Management",
    //       path: "/dashboard/services",
    //       role: "admin",
    //     },
    //     {
    //       label: "Local Server Management",
    //       path: "/dashboard/services",
    //       role: "admin",
    //     },
    //   ],
    // },
    {
      label: "By Pass Reports",
      path: "/dashboard/by-pass-report",
      role: ["guest", "user", "moderator", "admin"],
      children: [
        {
          label: "By Pass Reports",
          path: "/public/by-pass-report",
          role: ["guest", "user", "moderator", "admin"],
        },
        // {
        //   label: "LTM_Working_SRVR_01",
        //   path: "/dashboard/services",
        //   role: "admin",
        // },
        // {
        //   label: "LTM_Working_SRVR_02",
        //   path: "/dashboard/services",
        //   role: "admin",
        // },
        // {
        //   label: "LTM_Working_SRVR_03",
        //   path: "/dashboard/services",
        //   role: "admin",
        // },
      ],
    },
    // {
    //   label: "CRM",
    //   path: "/dashboard/services",
    //   role: ["admin"],
    //   children: [
    //     {
    //       label: "Analytics",
    //       path: "/dashboard/services",
    //       role: "admin",
    //     },
    //     {
    //       label: "Deals",
    //       path: "/dashboard/services",
    //       role: "admin",
    //     },
    //     {
    //       label: "Deal details",
    //       path: "/dashboard/services",
    //       role: "admin",
    //     },
    //     {
    //       label: "Leads",
    //       path: "/dashboard/services",
    //       role: "admin",
    //     },
    //     {
    //       label: "Lead details",
    //       path: "/dashboard/services",
    //       role: "admin",
    //     },
    //     {
    //       label: "Reports",
    //       path: "/dashboard/services",
    //       role: "admin",
    //     },
    //     {
    //       label: "Purchasers and sellers",
    //       path: "/dashboard/services",
    //       role: "admin",
    //     },
    //     {
    //       label: "Create a new lead",
    //       path: "/dashboard/services",
    //       role: "admin",
    //     },
    //   ],
    // },
    {
      label: "Data Entry",
      path: "/dashboard/tender-data-entry",
      role: ["admin"],
      children: [
        
        {
          label: "Tender Data Entry(TTI)",
          path: "/dashboard/tender-data-entry-tti",
          role: ["guest", "user", "moderator", "admin"],
        },
        {
          label: "Tender Ids",
          path: "/dashboard/tender-tenderIds",
          role: ["admin"],
        },
        {
          label: "Tenders (Need To Update)",
          path: "/dashboard/tender-categoryNull",
          role: ["admin"],
        },
      ],
    },
    {
      label: "Data Entry (ALL)",
      path: "/dashboard/tender-data-entry",
      role: ["admin"],
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
      label: "Public Routes",
      path: "/dashboard/tender-data-entry",
      role: ["guest", "user", "moderator", "admin"],
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
        {
          label: "Null Category Tender",
          path: "/public/tender-categoryNull",
          role: ["guest", "user", "moderator", "admin"],
        },
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
        {
          label: "Tender Data Entry (TTI)",
          path: "/public/tender-data-entry-tti",
          role: ["guest", "user", "moderator", "admin"],
        },
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
    <Sidebar>
      <SidebarHeader />
      <SidebarContent className="h-full">
        <div>
          <h1 className="text-2xl px-2 font-semibold pb-5 border-b text-red-700-">
            E-GP Automation
          </h1>
        </div>
        <div>
          <Link
            to="/"
            className="flex items-center gap-2 pl-2 font-semibold py-1 "
          >
            <House size={20} /> Home
          </Link>
          {routes?.map((route, idx) => (
            <DashboardRoutes
              index={idx}
              openIndex={openIndex}
              setOpenIndex={setOpenIndex}
              key={idx}
              route={route}
            />
          ))}

          <div className="px-2 mt-3 md:hidden">
            <Button
              className="cursor-pointer"
              variant={"destructive"}
              onClick={async () => {
                await logout();
                setUser(null);
                navigate("/", { replace: true });
              }}
            >
              {" "}
              Logout
            </Button>
          </div>
        </div>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

function DashboardRoutes({ route, openIndex, setOpenIndex, index }) {
  const { user, loading } = useContext(AuthContext);

  return (
    <Collapsible
      className="pl-2 "
      open={openIndex === index}
      onOpenChange={() => setOpenIndex(openIndex === index ? null : index)}
    >
      {(user?.role === "admin" ||
        !route?.role ||
        route?.role.includes(user?.role)) && (
        <CollapsibleTrigger className="flex gap-2 items-center font-semibold cursor-pointer py-1">
          {openIndex === index ? (
            <div className="flex items-center gap-2">
              <SquareMinus
                className={`${!route?.children && "text-gray-600"}`}
                size={20}
              />
              <p>{route?.label}</p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <SquarePlus
                className={`${!route?.children && "text-gray-600"}`}
                size={20}
              />
              <p>{route?.label}</p>
            </div>
          )}
        </CollapsibleTrigger>
      )}
      {route?.children
        ?.filter(
          (item) => item?.role.includes(user?.role) || user?.role === "admin"
        )
        .map((item, idx) => (
          <CollapsibleContent
            className="flex items-center gap-2 cursor-pointer pl-5 duration-300 py-1"
            key={idx}
          >
            <Minus size={16} /> <Link to={item?.path}>{item?.label}</Link>
          </CollapsibleContent>
        ))}
    </Collapsible>
  );
}
