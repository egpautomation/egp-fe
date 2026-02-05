// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useSingleData from "@/hooks/useSingleData";
import { MoveLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const ViewUser = () => {
  const { userId } = useParams();
  const url = `https://egpserver.jubairahmad.com/api/v1/user/get-single-user-by-userId?userId=${userId}`;
  const { data, loading } = useSingleData(url);

  return (
    <section className="min-h-lvh">
      <div className="mt-10">
        <Link to={"/dashboard/users"}>
          <Button className="cursor-pointer">
            <MoveLeft /> Go Back To Data Table
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-center my-8">
          User Details Information
        </h1>
      </div>
      <div className=" flex justify-center items-center">
        <div className="w-full max-w-xl shadow-2xl p-3 md:p-5 rounded border">
          {!loading && (
            <form className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="">
                <Label htmlFor="name">
                  Full Name<span className="text-red-700">*</span>
                </Label>
                <Input
                  type="text"
                  name="name"
                  value={data.name}
                  placeholder="Your Full Name"
                  className="mt-2"
                  required
                />
              </div>
              <div className="">
                <Label htmlFor="district">
                  District (LTM Tender)<span className="text-red-700">*</span>
                </Label>
                <Input
                  type="text"
                  name="presentAddress"
                  value={data.district}
                  placeholder="Your Present Address"
                  className="mt-2"
                  readOnly
                />
              </div>
              <div className="col-span-full">
                <Label htmlFor="presentAddress">Present Address</Label>
                <Input
                  type="text"
                  name="presentAddress"
                  value={data.presentAddress}
                  placeholder="Your Present Address"
                  className="mt-2 h-14"
                  readOnly
                />
              </div>

              <div className="">
                <Label className="mb-2" htmlFor="phoneNumber">
                  Active Contact Number<span className="text-red-700">*</span>
                </Label>
                <Input
                  required
                  defaultCountry="bd"
                  name="phoneNumber"
                  value={data.phone}
                  inputStyle={{
                    width: "100%", // Set a fixed width
                  }}
                  readOnly
                />
              </div>
              <div className="">
                <Label className="mb-2" htmlFor="What's app number">
                  Active What's App Number
                  <span className="text-red-700">*</span>
                </Label>

                <Input
                  required
                  defaultCountry="bd"
                  name="whatsApp"
                  value={data.whatsApp}
                  inputStyle={{
                    width: "100%", // Set a fixed width
                  }}
                  readOnly
                />
              </div>
              <div className="">
                <Label htmlFor="Email">
                  Email<span className="text-red-700">*</span>
                </Label>
                <Input
                  required
                  type="text"
                  name="email"
                  value={data.email}
                  placeholder="Your Email Address"
                  className="mt-2"
                  readOnly
                />
              </div>
              <div className="">
                <Label htmlFor="userID">
                  User ID<span className="text-red-700">*</span>
                </Label>

                <Input
                  required
                  type="text"
                  name="uerId"
                  value={data?.userId}
                  placeholder="Last 5 digit of your phone number"
                  className="mt-2"
                  readOnly
                />
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ViewUser;
