import React, { useContext, useState } from "react";
import UserContext from "../context/UserContext";
import { FaRegPlusSquare } from "react-icons/fa";
import { MdUpload } from "react-icons/md";
import { IconContext } from "react-icons/lib";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import axios from "axios";
const EditProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const [details, setDetails] = useState({
    fullname: "",
    email: "",
    address: "",
    avatar: null,
    avatarUrl: "",
  });
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setDetails({
        ...details,
        avatar: e.target.files[0],
        avatarUrl: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
  const updateAvatar = async () => {
    const {avatar} = details;
    const formData = new FormData();
    formData.append("avatar", avatar);
    try {
        const response = await axios.patch("/users/avatar", formData, {withCredentials: true});
        // update the value of user in localstorage
        localStorage.setItem("user", JSON.stringify(response.data.data));
    } catch (error) {
        const errorMessage = error.response.data.match(
            /<pre>Error: (.*?)<br>/
          )[1];
          setError(errorMessage);
  };
  }
  const updateDetails = async(e) =>{
    e.preventDefault()
    let {fullname, email} = details;
  
    if(fullname === '') fullname = user?.fullname;
    if(email === '') email = user?.email;
    
    try {
        const response = await axios.patch("/users/update-account", {fullname, email}, {withCredentials: true})
        setUser(response.data.data);
        localStorage.setItem("user", JSON.stringify(response.data.data));
    } catch (error) {
        const errorMessage = error.response.data.match(
            /<pre>Error: (.*?)<br>/
          )[1];
          console.log(errorMessage);
    }
  }
  const updateAddress = async (e) => {
    e.preventDefault()
    let {address} = details;
    if(address === '') address = user?.address;
    try {
        const response = await axios.post('/users/address',{address},{withCredentials: true});

        setUser(response.data.data)

    } catch (error) {
        const errorMessage = error.response.data.match(
            /<pre>Error: (.*?)<br>/
          )[1];
          console.log(errorMessage);
    }
  }
  return (
    <div className="flex justify-start gap-20 p-20">
      <div className="w-1/4 relative group">
        <img
          src={user?.avatar}
          alt={user?.username}
          className="h-80 aspect-square object-cover rounded-full border-2 border-gray-800"
        />
        <div className="absolute h-80 w-80 top-0  justify-center items-center rounded-full group-hover:flex hidden bg-gray-200 opacity-50">
          <Popup
            contentStyle={{ width: "30%", borderRadius: "10px" }}
            trigger={
              <button type="button">
                <IconContext.Provider value={{ color: "gray", size: "50px" }}>
                  <FaRegPlusSquare />
                </IconContext.Provider>
              </button>
            }
            modal
            nested
          >
            {(close) => (
              <div class="m-4 rounded-lg">
                <h1 class="text-3xl font-bold pb-4">
                  Choose an image from the gallary
                </h1>
                <form class="space-y-4 border-dashed">
                  <div>
                    <div className="relative flex justify-center items-center border-dashed border-2 border-gray-300 p-14">
                      <input
                        className="opacity-0 w-full h-full absolute inset-0 cursor-pointer"
                        type="file"
                        onChange={handleChange}
                        accept="image/*" // Specify accepted file types if needed
                      />
                      <button className="bg-blue-500 text-white px-4 py-2 text-lg rounded flex justify-center items-center gap-2">
                        <IconContext.Provider
                          value={{ color: "white", size: "25px" }}
                        >
                          <MdUpload />
                        </IconContext.Provider>{" "}
                        Browse
                      </button>
                    </div>
                    {details.avatarUrl && (
                      <img
                        src={details.avatarUrl}
                        alt="Avatar Preview"
                        className="w-20 h-20 m-4 object-cover"
                      />
                    )}
                  </div>
                  <div className="flex justify-between">
                    <button
                      className="bg-gray-800 text-white py-2 px-4 w-40 rounded hover:bg-gray-600 focus:outline-none focus:ring focus:border-gray-300"
                      type="submit" // Change type to button
                      onClick={(e) => {
                        e.preventDefault();
                        updateAvatar();
                        close();
                      }} // Call addList function on click
                    >
                      Upload
                    </button>
                    <button
                      className="bg-red-500 text-white py-2 px-4 w-40 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300"
                      type="button" // Change type to button
                      onClick={() => {
                        close();
                        setDetails({avatarUrl: ''})
                      }} // Call addList function on click
                    >
                      Close
                    </button>
                  </div>
                </form>
              </div>
            )}
          </Popup>
        </div>
      </div>
      <div className="w-3/4">
        <h1 className="text-3xl font-bold ">Edit details:</h1>
        <div className="">
          <form className="">
            <fieldset className="p-10 flex gap-4  flex-col w-full items-center bg-gray-100 border-2 border-gray-600 rounded-xl my-8">
              <legend className="text-lg ">Account Details</legend>
              <div className="flex gap-4 justify-end items-center w-full">
                <label className="font-semibold text-lg text-gray-600">
                  Full name:
                </label>
                <input
                  type="text"
                  defaultValue={user?.fullname}
                  onChange={(e)=>setDetails({...details, fullname: e.target.value})}
                  className="outline-none border-2 border-gray-700 py-2 px-4 rounded-lg bg-gray-50  w-3/4"
                />
              </div>
              <div className="flex gap-4 justify-end items-center w-full">
                <label className="font-semibold text-lg text-gray-600">
                  Email:
                </label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  onChange={(e)=>setDetails({...details, email: e.target.value})}
                  className="outline-none border-2 border-gray-700 py-2 px-4 rounded-lg bg-gray-50 w-3/4"
                />
              </div>
              <div className="flex justify-end w-full"><button onClick={updateDetails} className=" py-2 px-4 bg-gray-600 text-white rounded-lg text-lg">Update</button></div>
            </fieldset>
            <fieldset
              id="edit-address"
              className="p-10 flex gap-4 flex-col w-full items-center bg-gray-100 border-2 border-gray-600 rounded-xl my-8"
            >
              <legend className="text-lg ">Address</legend>
              <div className="flex gap-4 justify-end items-center w-full">
                <label className="font-semibold text-lg text-gray-600">
                  Enter Address:
                </label>
                <textarea
                  type="text"
                  rows={1}
                  defaultValue={user?.address}
                  onChange={(e)=>setDetails({...details, address: e.target.value})}
                  className="outline-none border-2 border-gray-700 py-2 px-4 rounded-lg bg-gray-50  w-3/4"
                />
              </div>
              <div className="flex justify-end w-full"><button onClick={updateAddress} className=" py-2 px-4 bg-gray-600 text-white rounded-lg text-lg">Update</button></div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
