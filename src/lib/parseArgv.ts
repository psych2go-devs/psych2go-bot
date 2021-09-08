export default function (str: string): string[] {
  let strTrim = str.trim();

  if (strTrim) return strTrim.split(" ");
  else return [];
}
