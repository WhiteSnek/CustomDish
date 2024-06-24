import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import axios from "axios";
import BGImage from "../assets/bg-image.jpg";
import { BiSolidShow, BiSolidHide } from "react-icons/bi";
import { IconContext } from "react-icons/lib";

const RegisterRestaurant = () => {
  const [show, setShow] = useState(false);
  const [details, setDetails] = useState({
    fullname: "",
    username: "",
    email: "",
    address: "",
    password: "",
    avatar: null,
    avatarUrl: ""
  });
  const { setRestaurant } = useContext(UserContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setDetails({
        ...details,
        avatar: e.target.files[0],
        avatarUrl: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if passwords match
    if (details.password !== confirmPassword) {
      setError("Password and Confirm Password do not match");
      return;
    }
    // Check if email has an account associated with it
    try {
      await register();
      navigate("/");
      setDetails({
        fullname: "",
        username: "",
        email: "",
        address: "",
        password: "",
        avatar: null,
        avatarUrl: ""
      })
      setError("");
    } catch (error) {
      const errorMessage = error.response.data.match(/<pre>Error: (.*?)<br>/)[1];
      console.log(errorMessage);
    }
  };

  const togglePasswordVisibility = () => {
    setShow((prevShowPassword) => !prevShowPassword);
  };

  const register = async () => {
    const { fullname, username, email,address, password, avatar } = details;
    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("password", password);
    formData.append("avatar", avatar);
    console.log(formData)
    const user = await axios.post("/restaurant/register", formData, {
      withCredentials: true,
    });
    setRestaurant(user.data.data);
  };

  return (
    <div className="bg-pink-200 rounded-lg w-4/5  mx-auto my-5 shadow-lg grid sm:grid-cols-12">
      <div className="col-span-6 hidden sm:block">
        <img src={BGImage} alt="bg-image" className="h-full rounded-l-md" />
      </div>
      <div className="col-span-6 p-6 sm:p-12 h-full flex flex-col justify-center items-center">
        <h3 className="text-3xl font-bold text-black pb-5">Restaurant Sign up</h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label htmlFor="fullname">Full name:</label>
          <input
            className="border border-blue-300 rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-500"
            id="fullname"
            type="text"
            placeholder="Enter fullname"
            value={details.fullname}
            onChange={(e) => setDetails({ ...details, fullname: e.target.value })}
          />
          <label htmlFor="username">User name:</label>
          <input
            className="border border-blue-300 rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-500"
            id="username"
            type="text"
            placeholder="Enter username"
            value={details.username}
            onChange={(e) => setDetails({ ...details, username: e.target.value })}
          />
          <label htmlFor="address">Address:</label>
          <textarea
            className="border border-blue-300 rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-500"
            id="address"
            placeholder="Enter address"
            value={details.address}
            onChange={(e) => setDetails({ ...details, address: e.target.value })}
          />
          <label htmlFor="email">Email Id:</label>
          <input
            className="border border-blue-300 rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-500"
            id="email"
            type="email"
            placeholder="Enter email"
            value={details.email}
            onChange={(e) => setDetails({ ...details, email: e.target.value })}
          />
          <label htmlFor="password">Password:</label>
          <div className="relative">
            <input
              className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:border-gray-500"
              id="password"
              type={show ? "text" : "password"}
              placeholder="Enter Password"
              value={details.password}
              onChange={(e) => setDetails({ ...details, password: e.target.value })}
            />
            <button type="button" className="absolute top-0 right-0 p-2" onClick={togglePasswordVisibility}>
              {show ? (
                <IconContext.Provider value={{ size: "27px" }}>
                  <BiSolidHide />
                </IconContext.Provider>
              ) : (
                <IconContext.Provider value={{ size: "27px" }}>
                  <BiSolidShow />
                </IconContext.Provider>
              )}
            </button>
          </div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <div className="relative">
            <input
              className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:border-gray-500"
              id="confirmPassword"
              type={show ? "text" : "password"}
              placeholder="Enter Password again"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="button" className="absolute top-0 right-0 p-2" onClick={togglePasswordVisibility}>
              {show ? (
                <IconContext.Provider value={{ size: "27px" }}>
                  <BiSolidHide />
                </IconContext.Provider>
              ) : (
                <IconContext.Provider value={{ size: "27px" }}>
                  <BiSolidShow />
                </IconContext.Provider>
              )}
            </button>
          </div>
          <label htmlFor="image">Image:</label>
          <input
            className="border border-blue-300 rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-500"
            id="image"
            type="file"
            placeholder="Upload your image"
            onChange={handleChange}
          />
          {details.avatarUrl && (
            <img src={details.avatarUrl} alt="Image Preview" className="w-20 h-20" />
          )}
          <div className="flex justify-between items-center">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
              type="submit"
            >
              Register
            </button>
          </div>
          <Link to="/login" className="text-blue-600 hover:text-blue-400">
            Already have an account? Sign in
          </Link>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default RegisterRestaurant;
