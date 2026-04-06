// @ts-nocheck

import EmergencyTender from "@/components/dashboard/AtAGlance/EmergencyTender";
import Greetings from "@/components/dashboard/AtAGlance/Greetings";
import TenderOpeningCalendar from "@/components/dashboard/AtAGlance/OpeningDateTender";
import OrderStats from "@/components/dashboard/AtAGlance/OrderStats";
import RecentOrder from "@/components/dashboard/AtAGlance/RecentOrder";
import OtmBypassReportStats from "@/components/dashboard/AtAGlance/OtmBypassReportStats";
import RecentOtmBypassOrder from "@/components/dashboard/AtAGlance/RecentOtmBypassOrder";

const AtAGlance = () => {
  return (
    <section>
      <Greetings />
      <OrderStats />
      <RecentOrder />
      <OtmBypassReportStats />
      <RecentOtmBypassOrder />
      <div className="my-16">
        <TenderOpeningCalendar />
      </div>
    </section>
  );
};

export default AtAGlance;
