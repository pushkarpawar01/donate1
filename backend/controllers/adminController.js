import User from "../models/User.js";

const getUnapprovedNgos = async (req, res) => {
  try {
    const ngos = await User.find({ role: "NGO", isApproved: false });
    res.status(200).json(ngos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching NGOs" });
  }
};

const approveNgo = async (req, res) => {
  try {
    const ngo = await User.findById(req.params.ngoId);
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }
    ngo.isApproved = true;
    await ngo.save();
    res.status(200).json({ message: "NGO approved" });
  } catch (error) {
    res.status(500).json({ message: "Error approving NGO" });
  }
};

export default {
  getUnapprovedNgos,
  approveNgo,
};
