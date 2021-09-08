export default (roleIdString: string | undefined) => {
  let idString = roleIdString || "";

  return idString
    .split(",")
    .filter((v) => v)
    .map((v) => v.trim());
};
