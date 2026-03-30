// @ts-nocheck
export function Detail({ label, value }) {
  return (
    <div className="flex w-full bgg-blue-800 justify---between gap-3 py-4 border-b ">
      <p className=" font-medium w-[30%] bgg-red-800">{label}</p>
      <div className="whitespace-pre-wrap text-gray-500 font-semibold w-[70%] bgg-purple-800">
        {value || "N/A"}
      </div>
    </div>
  );
}
