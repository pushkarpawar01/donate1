import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  imageUrl: String,
},{timestamps:true});

const Image = mongoose.model("Image", imageSchema);
export default Image;
