import React, {
  useState,
  ChangeEvent,
  useRef,
  KeyboardEvent,
  useEffect,
} from "react";
import { useAppDispatch, useAppSelector } from "../Store/store";
// import { clearErrors } from "../Features/Error/errorSlice";

type ILoginProps = {
  getOTP: (otp: string) => void;
};

function OTPInput({ getOTP }: ILoginProps) {
  const dispatch = useAppDispatch();
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const { errors } = useAppSelector((state) => state.error);
  const [showResend, setShowResend] = useState<boolean>(false);
  const errText: string = errors[0]?.message?.message;

  // Event handler to update OTP value for each input box
  const handleInputChange = (index: number, value: string) => {
    if (!isNaN(Number(value)) && value !== "") {
      const updatedOTP = [...otp];
      updatedOTP[index] = value;
      setOTP(updatedOTP);

      // Focus on the next input box if available
      if (index < 5 && value !== "" && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Event handler for handling backspace key press
  const handleBackspace = (index: number) => {
    if (
      index > 0 &&
      (!otp[index] || otp[index]) &&
      inputRefs.current[index - 1]
    ) {
      const updatedOTP = [...otp];
      if (otp[index]) updatedOTP[index] = "";
      updatedOTP[index - 1] = "";
      setOTP(updatedOTP);
      inputRefs.current[index - 1]?.focus();
    } else if (index === 0 && !otp[index]) {
      // Handle backspace on the first input box
      const updatedOTP = [...otp];
      updatedOTP[index] = "";
      setOTP(updatedOTP);
    } else if (!otp[index] && inputRefs.current[index - 1]) {
      // Handle backspace on the last input box
      const updatedOTP = [...otp];
      updatedOTP[index - 1] = "";
      setOTP(updatedOTP);
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Event handler to prevent non-numeric characters
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!/^\d$/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault();
    }
  };

  const OtpStr = () => {
    let otpStr = otp.join("");
    getOTP(otpStr);
  };

  useEffect(() => {
    if (errors?.length > 0) {
      if (errText === "Expired OTP") {
        setShowResend(true);
      } else if (errors[0]?.message?.code === 200) {
        // console.log("errMessage: ", errText);
        if (errText?.includes("Code to verify")) {
          setShowResend(false);
          setOTP(["", "", "", "", "", ""]);
        } else if (errText === "Verified email") {
          // dispatch(clearErrors());
          //   window.location.reload();
        }
      }
    }
  }, [dispatch, errors, errText]);

  return (
    <div className="otp-input">
      <h3>Enter OTP</h3>
      {/* {showResend && ( */}
      <div
        style={{
          color:
            errText?.includes("Code to verify") ||
            errText?.includes("created successfully")
              ? "green"
              : "red",
          margin: "0px auto 8px auto",
          width: "80%",
        }}
      >
        {errText}
        {errText?.includes("created successfully") &&
          ", Please enter the OTP you received in your email in below boxes"}
        {errText?.includes("Expired OTP") &&
          ", Please click the button to receive new OTP"}
        {errText?.includes("Unverified email") &&
          ", Please enter the OTP you receive"}
      </div>
      {/* )} */}
      <div>
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            id={`otp-input-${index}`}
            value={digit}
            maxLength={1}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange(index, e.target.value)
            }
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Backspace") {
                handleBackspace(index);
              } else {
                handleKeyDown(e);
              }
            }}
            ref={(input) => {
              inputRefs.current[index] = input;
            }}
          />
        ))}
      </div>
      <div className="btn-group">
        {!showResend ? (
          <button type="submit" onClick={OtpStr}>
            Verify Email
          </button>
        ) : (
          showResend && <button type="submit">Resend Code</button>
        )}
      </div>
    </div>
  );
}

export default OTPInput;
