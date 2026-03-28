// Number to words conversion for Bengali currency format
 export  const numberToWords = (num:string | number) => {
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

    if (num === 0) return "zero";

    const numToWordsBelowThousand = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
      return (
        a[Math.floor(n / 100)] +
        " hundred" +
        (n % 100 ? " " + numToWordsBelowThousand(n % 100) : "")
      );
    };

    let result = "";

    if (Math.floor(num / 10000000) > 0) {
      result += numToWordsBelowThousand(Math.floor(num / 10000000)) + " crore ";
      num %= 10000000;
    }
    if (Math.floor(num / 100000) > 0) {
      result += numToWordsBelowThousand(Math.floor(num / 100000)) + " lakh ";
      num %= 100000;
    }
    if (Math.floor(num / 1000) > 0) {
      result += numToWordsBelowThousand(Math.floor(num / 1000)) + " thousand ";
      num %= 1000;
    }
    if (Math.floor(num / 100) > 0) {
      result += numToWordsBelowThousand(Math.floor(num / 100)) + " hundred ";
      num %= 100;
    }
    if (num > 0) {
      result += numToWordsBelowThousand(num) + " ";
    }

    return result.trim();
  };