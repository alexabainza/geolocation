import mongoose from "mongoose";

const searchSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ip_searched: {
      type: String,
      required: true,
    },
    locationData: {
      ip: {
        type: String,
        required: true,
      },
      hostname: String,
      city: String,
      region: String,
      country: String,
      location: {
        latitude: Number,
        longitude: Number,
      },
      organization: String,
      postal: String,
      timezone: String,
      anycast: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Search = mongoose.model("Search", searchSchema);
export default Search;
