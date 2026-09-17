const { asyncHandler, ApiError } = require("../utils/errors");
const Company = require("../models/Company");

const getMine = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ owner: req.user._id });
  res.json({ company });
});

const upsert = asyncHandler(async (req, res) => {
  const { name, description, website, location, size } = req.body;
  if (!name) throw new ApiError(400, "Company name is required");

  const company = await Company.findOneAndUpdate(
    { owner: req.user._id },
    { name, description, website, location, size, owner: req.user._id },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.json({ company });
});

const getById = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id).populate("owner", "name email");
  if (!company) throw new ApiError(404, "Company not found");
  res.json({ company });
});

module.exports = { getMine, upsert, getById };
