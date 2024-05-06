import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomePage from "./HomePage";

const Register = () => {
  const navigate = useNavigate();

  const [userDetail, setUserDetail] = useState({
    username: "",
    roomname: "",
  });

  const handleChanges = (e) => {
    const { value, name } = e.target;
    setUserDetail({
      ...userDetail,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/home",{
      state : userDetail
    });
  };

  return (
    <form style={{ margin: "5rem" }} onSubmit={handleSubmit}>
      <div data-mdb-input-init className="form-outline mb-4 d-flex ">
        <label className="form-label" htmlFor="form2Example1">
          User Name
        </label>
        <input
          type="text"
          id="form2Example1"
          className="form-control p-3"
          name="username"
          placeholder="Username..."
          onChange={handleChanges}
        />
      </div>

      <div data-mdb-input-init className="form-outline mb-4 d-flex ">
        <label className="form-label" htmlFor="form2Example2">
          Room
        </label>
        <input
          type="text"
          id="form2Example2"
          className="form-control p-3"
          placeholder="Room..."
          name="roomname"
          onChange={handleChanges}
        />
      </div>

      <button
        type="submit"
        data-mdb-button-init
        data-mdb-ripple-init
        className="btn btn-primary btn-block mb-4"
      >
        Sign in
      </button>
    </form>
  );
};

export default Register;
