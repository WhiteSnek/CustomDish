import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import axios from "axios";
import BGImage from "../assets/bg-image.jpg";
import { BiSolidShow } from "react-icons/bi";
import { BiSolidHide } from "react-icons/bi";
import { IconContext } from "react-icons/lib";

const RegisterRestaurant = () => {
  const [show, setShow] = useState(false);
  const [details, setDetails] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
    avatarUrl: ""
  });
  const { setUser } = useContext(UserContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
    // Check if email has an account associated with it
    register();
    navigate("/");
    setError("");
  };
  const togglePasswordVisibility = () => {
    setShow((prevShowPassword) => !prevShowPassword);
  };

  const register = async () => {
    try {
      const { fullname, username, email, password, avatar } = details;
      const formData = new FormData();
      formData.append("fullname", fullname);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("avatar", avatar);
      const user = await axios.post("/users/register", formData, {
        withCredentials: true,
      });
      const userInfo = user.data.data.user;
      setUser(userInfo);
      
    } catch (error) {
      const errorMessage = error.response.data.match(
        /<pre>Error: (.*?)<br>/
      )[1];
      setError(errorMessage)
    }
  };

  return (
    <div className=" bg-pink-200 rounded-lg w-4/5 h-screen mx-auto my-5 shadow-lg grid grid-cols-12">
      <div className="col-span-6">
        <img src={BGImage} alt="bg-image" className="h-full" />
      </div>
      <div className="col-span-6 p-12 h-full flex flex-col justify-center items-center">
      <h3 className="text-3xl font-bold text-black pb-5">Sign up</h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label htmlFor="fullname">Full name:</label>
        <input
          className="border border-blue-300 rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-500"
          id="fullname"
          type="text"
          placeholder="Enter fullname"
          defaultValue={details.fullname}
          onChange={(e) => setDetails({ ...details, fullname: e.target.value })}
        />
        <label htmlFor="username">User name:</label>
        <input
          className="border border-blue-300 rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-500"
          id="username"
          type="text"
          placeholder="Enter username"
          defaultValue={details.username}
          onChange={(e) => setDetails({ ...details, username: e.target.value })}
        />
        <label htmlFor="email">Email Id:</label>
        <input
          className="border border-blue-300 rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-500"
          id="email"
          type="email"
          placeholder="Enter email"
          defaultValue={details.email}
          onChange={(e) => setDetails({ ...details, email: e.target.value })}
        />
        <label htmlFor="password">Password:</label>
          <div className="relative">
            <input
              className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:border-gray-500"
              id="password"
              type={show ? "text" : "password"}
              placeholder="Enter Password"
              defaultValue={details.password}
              onChange={(e) => setDetails({ ...details, password: e.target.value })}
            />
            <button type="button" className="absolute top-0 right-0 p-2" onClick={togglePasswordVisibility}>
              {show ?  <IconContext.Provider value={{  size: "27px" }}>
                <BiSolidHide />
              </IconContext.Provider> : <IconContext.Provider value={{  size: "27px" }}>
                <BiSolidShow />
              </IconContext.Provider>}
            </button>
          </div>
        <label htmlFor="avatar">Avatar:</label>
        <input
          className="border border-blue-300 rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-500"
          id="avatar"
          type="file"
          placeholder="Enter your avatar"
          onChange={handleChange}
        />
        {details.avatarUrl && (
          <img src={details.avatarUrl} alt="Avatar Preview" className="w-20 h-20" />
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
