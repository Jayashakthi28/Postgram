import { TextField, Typography, Button, Alert } from "@mui/material";
import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

export default function Registeration() {
  const [allOk, setallOk] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    options: [],
  });
  const [userSelectedTopic, setuserSelectedTopic] = useState([]);
  const [formApiSubmit, setformApiSubmit] = useState(false);
  const [formApiSuccess, setformApiSuccess] = useState("");
  const [apiResponse, setapiResponse] = useState({ status: "loading" });
  const navigate = useNavigate();
  const inputHandler = (value, filed) => {
    setFormData((prev) => {
      let newData = { ...prev };
      newData[filed] = value;
      return newData;
    });
  };

  useEffect(() => {
    function userDataSetter() {
      let userData = api.getUserData();
      setFormData((prev) => {
        let newData = { ...prev };
        newData.email = userData.email;
        newData.name = userData.name;
        return newData;
      });
    }
    async function fetcher() {
      let topicsData = await api.get("/tags");
      topicsData = topicsData.data.map((t) => ({
        value: t,
        label: t,
      }));
      setFormData((prev) => {
        let newData = { ...prev };
        newData.options = topicsData;
        return newData;
      });
    }
    userDataSetter();
    fetcher();
  }, []);

  useEffect(() => {
    if (formData.name.length !== 0 && userSelectedTopic.length !== 0) {
      setallOk(true);
    } else {
      setallOk(false);
    }
  }, [formData, userSelectedTopic]);

  useEffect(() => {
    if (apiResponse.status === "success") {
      setformApiSuccess(true);
    } else {
      setformApiSuccess(false);
    }
  }, [apiResponse]);

  if (formApiSuccess === true) {
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }

  const formSubmitter = async () => {
    let formSubmitData = {
      name: formData.name,
      email: formData.email,
      tags: userSelectedTopic,
    };
    setallOk(true);
    setformApiSubmit(true);
    let temapiResponse = await api.post("register", formSubmitData);
    setapiResponse(temapiResponse);
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)] flex-col">
      {formApiSubmit && formApiSuccess === "" && (
        <Alert severity="info" className=" my-1">
          Request sent to API
        </Alert>
      )}
      {formApiSubmit && formApiSuccess && (
        <Alert severity="success" className=" my-1">
          Registered successfully
        </Alert>
      )}
      {formApiSubmit && formApiSuccess === false && (
        <Alert severity="error" className=" my-1">
          Try again after some time
        </Alert>
      )}
      <form className=" flex flex-col flex-wrap w-3/6 min-w-max p-3 text-center shadow-lg shadow-purple-600 rounded-lg">
        <Typography component="h3" variant="h5" fontWeight="bold">
          Before you proceed choose your preferences...
        </Typography>
        <TextField
          id="name"
          label="Name"
          variant="outlined"
          required
          value={formData.name}
          onChange={(e) => {
            inputHandler(e.target.value, "name");
          }}
          color="secondary"
          className=" !my-1"
          disabled={formApiSubmit}
        />
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          required
          color="secondary"
          className=" !my-1"
          disabled
          value={formData.email}
        />
        <Select
          isMulti
          name="topics"
          options={formData.options}
          placeholder="Choose Tags"
          className=" font-bubbler my-1"
          onChange={(e) => {
            let userArr = e.map((t) => t.value);
            console.log(userArr);
            setuserSelectedTopic(userArr);
          }}
          theme={(theme) => ({
            ...theme,
            backgroundColor: "black",
            borderRadius: 3,
            colors: {
              ...theme.colors,
              primary25: "rgb(243 232 255)",
              primary: "purple",
            },
          })}
        />
        <Button
          variant="outlined"
          color="secondary"
          className=" self-center !my-1"
          disabled={!allOk || formApiSubmit}
          onClick={formSubmitter}
        >
          Proceed
        </Button>
      </form>
    </div>
  );
}
