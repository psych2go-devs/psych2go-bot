import readAssetFile from "./readAssetFile";
import formatMessage from "format-message";

formatMessage.setup({ missingTranslation: "ignore" });

export function formatPluralKitMessage(args: string[]) {
  let formatedArgs = args.length ? " ".concat(args.join(" ")) : "";

  return formatMessage(readAssetFile("pluralkit-message.txt"), {
    ARGS: formatedArgs
  });
}
