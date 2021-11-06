import insporationalQuotes from "../asset/inspirationalQuotes.json";
import striptags from "striptags";
import { InspirationalQuote } from "../interface/InspirationalQuotes";

let quotes: InspirationalQuote[] = [];

insporationalQuotes.data.forEach((rawQuote) => {
  let strippedRawQuote = striptags(rawQuote.inspirational_quote);
  let splitedRawQuote = strippedRawQuote.substr(1).split("” - ");

  quotes.push({
    quote: splitedRawQuote[0],
    author: splitedRawQuote[1]
  });
});

export default quotes;
