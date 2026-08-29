import Authority from "../models/Authority.js";

export const findAuthority = async ({ issueType, area }) => {
  let authority = null;

  if (area) {
    authority = await Authority.findOne({
      active: true,
      area: area,
      issueTypes: issueType,
    });
  }

  if (!authority) {
    authority = await Authority.findOne({
      active: true,
      issueTypes: issueType,
    });
  }

  return authority;
};
