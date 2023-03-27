import splitEnvStringToArray from "./splitEnvStringToArray";

export default {
  devRoleIds: splitEnvStringToArray(process.env.STAFF_ROLE_ID),
  adminRoleIds: splitEnvStringToArray(process.env.ADMIN_ROLE_ID)
};
