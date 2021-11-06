import { QuoteResponse } from "../interface/Quote";
import axios from "axios";

export default async function () {
  let { data: quote } = await axios.get<QuoteResponse>(
    "https://api.quotable.io/random?tags=inspirational"
  );

  return quote;
}
