import React, { useState } from "react";
import { useParams } from "react-router-dom";

function ResetPassword() {
  const { USER_ID, USER_EMAIL, TOKEN } = useParams();
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    const passwordError = document.querySelector(".password.error");
    if (password2 === "") {
      passwordError.textContent = "Confim password is required";
      return;
    } else if (password1 !== password2) {
      passwordError.textContent = "Confim password doesn't match Password";
      return;
    }
    try {
      const response = await fetch("/forget-password", {
        method: "PUT",
        body: JSON.stringify({ password1, password2 }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const JSONres = await response.json();
      console.log(JSONres.msg);
      passwordError.textContent = "Password Reset";
      setPassword1("");
      setPassword2("");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <h2>Reset Password</h2>
      <label for="password1">Password</label>
      <input
        type="password"
        value={password1}
        required
        onChange={(e) => setPassword1(e.target.value)}
      />
      <div class="password error"></div>
      <label for="password2">Confim Password</label>
      <input
        type="password"
        value={password2}
        required
        onChange={(e) => setPassword2(e.target.value)}
      />
      <div class="password error"></div>
      <button>Reset</button>
    </form>
  );
}

export default ResetPassword;
