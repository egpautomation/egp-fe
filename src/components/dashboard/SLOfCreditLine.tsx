// @ts-nocheck

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const SlOfCreditLine = ({ setFormData, value }) => {
  return (
    <Select
      onValueChange={(value) => {
        setFormData((prev) => ({
          ...prev,
          SLOfCredit: value,
        }));
      }}
      value={value}
    >
      <SelectTrigger className="mt-2 w-full">
        <SelectValue placeholder="Select SL No of Credit Line" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>SL No</SelectLabel>
          <SelectItem value="none">Not Upload</SelectItem>
          <SelectItem value="1">1</SelectItem>
          <SelectItem value="2">2</SelectItem>
          <SelectItem value="3">3</SelectItem>
          <SelectItem value="4">4</SelectItem>
          <SelectItem value="5">5</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SlOfCreditLine;
