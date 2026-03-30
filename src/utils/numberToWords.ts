// Number to words conversion for Bengali currency format
export const numberToWords = (num: string | number) => {
  const a = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const b = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  let n = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(n) || n === 0) return n === 0 ? "zero" : "";

    const numToWordsBelowThousand = (val: number): string => {
      if (val < 20) return a[val];
      if (val < 100) return b[Math.floor(val / 10)] + (val % 10 ? " " + a[val % 10] : "");
      return (
        a[Math.floor(val / 100)] +
        " hundred" +
        (val % 100 ? " " + numToWordsBelowThousand(val % 100) : "")
      );
    };

    let result = "";

    if (Math.floor(n / 10000000) > 0) {
      result += numToWordsBelowThousand(Math.floor(n / 10000000)) + " crore ";
      n %= 10000000;
    }
    if (Math.floor(n / 100000) > 0) {
      result += numToWordsBelowThousand(Math.floor(n / 100000)) + " lakh ";
      n %= 100000;
    }
    if (Math.floor(n / 1000) > 0) {
      result += numToWordsBelowThousand(Math.floor(n / 1000)) + " thousand ";
      n %= 1000;
    }
    if (Math.floor(n / 100) > 0) {
      result += numToWordsBelowThousand(Math.floor(n / 100)) + " hundred ";
      n %= 100;
    }
    if (n > 0) {
      result += numToWordsBelowThousand(Math.floor(n)) + " ";
    }

    return result.trim();
  };