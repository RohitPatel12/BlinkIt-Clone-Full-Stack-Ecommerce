import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js"; 


export const addAddressController = async (req, res) => {
  try {
    const { address_line, city, state, country, pincode, mobile, isDefault } = req.body;
    const userId = req.userId;

    // If this is going to be default, reset other addresses
    if (isDefault) {
      await AddressModel.updateMany(
        { userId },
        { $set: { isDefault: false } }
      );
    }

    const newAddress = new AddressModel({
      address_line,
      city,
      state,
      country,
      pincode,
      mobile,
      isDefault: !!isDefault, // store true/false exactly as sent
      userId,
      status: true
    });

    await newAddress.save();

    return res.json({
      success: true,
      message: "Address added successfully",
      data: newAddress
    });
  } catch (error) {
    console.error("Add address error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Get all active addresses for user
 */
export const getAddressController = async (req, res) => {
  try {
    const userId = req.userId;
    const addresses = await AddressModel.find({ userId, status: true });

    return res.json({ success: true, data: addresses });
  } catch (error) {
    console.error("Get address error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Update address
 */
export const updateAddressController = async (req, res) => {
  try {
    const { _id, address_line, city, state, country, pincode, mobile, isDefault } = req.body;
    const userId = req.userId;

    // If this is set as default, clear other defaults first
    if (isDefault) {
      await AddressModel.updateMany(
        { userId },
        { $set: { isDefault: false } }
      );
    }

    const updatedAddress = await AddressModel.findByIdAndUpdate(
      _id,
      {
        address_line,
        city,
        state,
        country,
        pincode,
        mobile,
        isDefault: !!isDefault
      },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Address updated successfully",
      data: updatedAddress
    });
  } catch (error) {
    console.error("Update address error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Soft delete address
 */
export const deleteAddresscontroller = async (req, res) => {
  try {
    const { _id } = req.body;

    await AddressModel.findByIdAndUpdate(_id, { status: false });

    return res.json({ success: true, message: "Address removed" });
  } catch (error) {
    console.error("Delete address error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const setDefaultAddressController = async (request, response) => {
  try {
    const userId = request.userId;
    const { _id } = request.body;

    // unset all other defaults
    await AddressModel.updateMany({ userId }, { $set: { isDefault: false } });

    // set this one
    await AddressModel.updateOne({ _id, userId }, { $set: { isDefault: true } });

    return response.json({
      message: "Default address updated",
      error: false,
      success: true
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
};


