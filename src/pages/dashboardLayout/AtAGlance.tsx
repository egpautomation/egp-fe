// @ts-nocheck

import EmergencyTender from "@/components/dashboard/AtAGlance/EmergencyTender";
import Greetings from "@/components/dashboard/AtAGlance/Greetings";
import OrderStats from "@/components/dashboard/AtAGlance/OrderStats";
import RecentOrder from "@/components/dashboard/AtAGlance/RecentOrder";

const AtAGlance = () => {
  return (
   <section>
    <Greetings />
    <OrderStats />
    <RecentOrder />
    <EmergencyTender />
   </section>
  );
};

export default AtAGlance;
