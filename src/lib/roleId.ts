import splitEnvStringToArray from "./splitEnvStringToArray";

export default {
  staffRoleIds: splitEnvStringToArray(process.env.STAFF_ROLE_ID),
  adminRoleIds: splitEnvStringToArray(process.env.ADMIN_ROLE_ID)
};
