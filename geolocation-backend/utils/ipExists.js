import Search from "../models/search.model.js";
import { errorHandler } from "./error.js";

export const checkIpExistsForUser = async (userId, ipAddress) => {
  try {
    const user = await Search.findOne({
      user: userId,
      ip_searched: ipAddress,
    });
    return user;
  } catch (error) {
    throw new Error("Error checking IP existence");
  }
};
