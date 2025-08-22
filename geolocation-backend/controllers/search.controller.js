import Search from "../models/search.model.js";
import { errorHandler } from "../utils/error.js";
import { checkIpExistsForUser } from "../utils/ipExists.js";

export const createSearch = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const searchData = {
      ...req.body,
      user: userId,
    };

    const searchResult = await checkIpExistsForUser(
      userId,
      req.body.ip_searched
    );
    if (searchResult) {
      searchResult.updatedAt = new Date();
      await searchResult.save();
      return res.status(200).json({
        success: true,
        message: "Successfully updated record!",
        searchItem: searchResult,
      });
    }
    const searchItem = await Search.create(searchData);

    return res.status(201).json({
      success: true,
      message: "Successfully created record!",
      searchItem: searchItem,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSearch = async (req, res, next) => {
  const { search_item_ids } = req.body;
  const userId = req.user.id;

  if (
    !search_item_ids ||
    !Array.isArray(search_item_ids) ||
    search_item_ids.length === 0
  ) {
    return next(errorHandler(404, "Search item is required"));
  }

  try {
    const searchItems = await Search.find({
      _id: { $in: search_item_ids },
      user: userId,
    });
    if (searchItems.length !== search_item_ids.length) {
      return next(
        errorHandler(403, "Some search items not found or unauthorized")
      );
    }

    const result = await Search.deleteMany({
      _id: { $in: search_item_ids },
      user: userId,
    });
    res.status(200).json({
      message: `${result.deletedCount} search items deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

export const getSearch = async (req, res, next) => {
  const search_item_id = req.params.id;
  const userId = req.user.id;

  try {
    const search = await Search.findOne({
      _id: search_item_id,
      user: userId,
    });
    if (!search) {
      return next(errorHandler(404, "Search not found"));
    }
    res.status(200).json({ success: true, search: search });
  } catch (error) {
    next(errorHandler);
  }
};
export const getSearches = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const searches = await Search.find({
      user: userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: searches.length,
      searches: searches,
    });
  } catch (error) {
    next(errorHandler(400, "Error fetching data"));
  }
};
