import React, { useState } from "react";
import { useSelector } from "react-redux";
import AddAddress from "../components/AddAddress";
import { MdDelete, MdEdit } from "react-icons/md";
import EditAddressDetails from "../components/EditAddressDetails";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { useGlobalContext } from "../provider/GlobalProvider";

const Address = () => {
  const addressList = useSelector((state) => state.addresses.addressList);
  const [openAddress, setOpenAddress] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const { fetchAddress } = useGlobalContext();

  const handleDisableAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data: { _id: id },
      });
      if (response.data.success) {
        toast.success("Address Removed");
        if (fetchAddress) fetchAddress();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.setDefaultAddress,
        data: { _id: id },
      });
      if (response.data.success) {
        toast.success("Default address updated");
        fetchAddress();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-white shadow-lg px-2 py-2 flex justify-between gap-4 items-center">
        <h2 className="font-semibold text-ellipsis line-clamp-1">Address</h2>
        <button
          onClick={() => setOpenAddress(true)}
          className="border border-primary-200 text-primary-200 px-3 hover:bg-primary-200 hover:text-black py-1 rounded-full"
        >
          Add Address
        </button>
      </div>

      {/* Address List */}
      <div className="bg-blue-50 p-2 grid gap-4">
        {addressList.map((address) => (
          <div
            key={address._id}
            className={`border rounded p-3 flex justify-between items-start bg-white ${
              !address.status && "hidden"
            }`}
          >
            {/* Address Details */}
            <div className="w-full">
              <p>{address.address_line}</p>
              <p>{address.city}</p>
              <p>{address.state}</p>
              <p>
                {address.country} - {address.pincode}
              </p>
              <p>{address.mobile}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 items-end">
              {/* Default Button / Badge */}
              {address.isDefault ? (
                <span className="text-green-600 font-semibold">
                  ✅ Default
                </span>
              ) : (
                <button
                  onClick={() => handleSetDefault(address._id)}
                  className="text-sm px-2 py-1 border border-primary-200 rounded hover:bg-primary-200 hover:text-black"
                >
                  Set as Default
                </button>
              )}

              {/* Edit + Delete Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setOpenEdit(true);
                    setEditData(address);
                  }}
                  className="bg-green-200 p-1 rounded hover:text-white hover:bg-green-600"
                >
                  <MdEdit />
                </button>
                <button
                  onClick={() => handleDisableAddress(address._id)}
                  className="bg-red-200 p-1 rounded hover:text-white hover:bg-red-600"
                >
                  <MdDelete size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add Address Box */}
        <div
          onClick={() => setOpenAddress(true)}
          className="h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer"
        >
          Add address
        </div>
      </div>

      {/* Add/Edit Modals */}
      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
      {openEdit && (
        <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />
      )}
    </div>
  );
};

export default Address;
