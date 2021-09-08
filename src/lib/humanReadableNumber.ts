const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  notation: "compact"
});

export default function (num: number | string) {
  return numberFormatter.format(BigInt(num));
}
