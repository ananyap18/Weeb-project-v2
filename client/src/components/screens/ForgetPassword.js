import React, {useState} from 'react'

function ForgetPassword() {
  const [forgetPasswordEmail, setForgetPasswordEmail] = useState('')

  const submitHandler = async (e) => {
      e.preventDefault()
      const emailError = document.querySelector('.email.error')
      // reset errors
      emailError.textContent = '';
      try{
        const res = await fetch('/forget-password', { 
        method: 'POST', 
        body: JSON.stringify({ email: forgetPasswordEmail }),
        headers: {'Content-Type': 'application/json'}
      })
      const data = await res.json();
      console.log(data);
      // check for errors in response "data"
      if(data.errors){
        emailError.textContent = data.errors.resetError
      }
      // no errors
      if(data.user){
        emailError.textContent = 'email has been sent to you'
      }
      }catch(err){
        console.log(err)
      }
      setForgetPasswordEmail('')              
  }

  const ForgetPasswordEmailHandler = (e) => {
    setForgetPasswordEmail(e.target.value);
  }

  return (
  <form onSubmit={submitHandler}>
  <h2>Forget Password</h2>
  <label htmlFor="email">Email</label>
  <input type="text" name="email" required onChange={ForgetPasswordEmailHandler}/>
  <div class="email error"></div>
  <button>Send email</button>
  </form>
  )
}

export default ForgetPassword
