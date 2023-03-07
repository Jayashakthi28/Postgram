import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/material/Button";
import axios from "axios";
import { Alert } from "@mui/material";
import { api } from "../utils/api";

export default function EmailVerify() {
  const { user } = useAuth0();

  const [verifyEmail, setverifyEmail] = useState({
    isPressed: false,
    isPending: false,
    isSent: false,
  });
  const [jobId, setJobId] = useState("");
  const [apiResponse, setapiResponse] = useState({});
  let interval;

  useEffect(() => {
    function fetcher() {
      if (!apiResponse.status) return;
      let newState = { ...verifyEmail };
      newState.isPressed = true;
      newState.isPending = apiResponse.status === "pending" ? true : false;
      newState.isSent = apiResponse.status === "completed" ? true : false;
      setverifyEmail(newState);
      setJobId(apiResponse.id);
    }
    fetcher();
  }, [apiResponse]);

  useEffect(() => {
    if (jobId === "") return;
    interval = setInterval(checkStatus, 1000);
  }, [jobId]);

  const postData = {
    user_id: user.sub,
  };

  const checkStatus = async () => {
    let jobStatus = {
      id: jobId,
    };
    const emailSentStatus = await api.post("email/check", jobStatus);
    if (emailSentStatus.status === "completed") {
      clearInterval(interval);
      setverifyEmail((prev) => {
        let newState = { ...prev };
        newState.isSent = true;
        return newState;
      });
    }
  };

  const sendResendLink = async () => {
    setverifyEmail((prev) => {
      let newstate = { ...prev };
      newstate.isPressed = true;
      return newstate;
    });
    const emailStatus = await api.post("email/verify", postData);
    setapiResponse(emailStatus);
  };

  return (
    <div className=" w-full h-[calc(100vh-83.27px)] flex flex-col justify-center items-center bg-fixed bg-bottom bg-no-repeat bg-[url('/src/assets/waves-bg.svg')]">
      {verifyEmail.isPressed && !verifyEmail.isSent && (
        <Alert severity="info" className=" m-3">
          Request sent to the API
        </Alert>
      )}
      {verifyEmail.isPressed && verifyEmail.isSent && (
        <Alert severity="success" className=" m-3">
          Successfully sent
        </Alert>
      )}
      <div className=" flex justify-center items-center p-11 backdrop-blur-sm bg-white flex-col shadow-card rounded-lg mx-3">
        <Typography
          variant="h5"
          component="h5"
          fontWeight="800"
          className=" text-center p-3"
        >
          Verify Email
        </Typography>
        <Typography variant="h6" component="h6">
          Please verify your email to proceed by clicking the link sent to your
          email
        </Typography>
        <Button
          variant="contained"
          onClick={sendResendLink}
          disabled={verifyEmail.isPressed}
        >
          Resend Email
        </Button>
      </div>
    </div>
  );
}
