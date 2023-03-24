export default (envString: string | undefined) => {
  let str = envString || "";

  return str
    .split(",")
    .filter((v) => v)
    .map((v) => v.trim());
};
