# Project Title
####Register
http://localhost:4000/api/auth/register
{
    "name": "shenori",
    "email": "shenoriruwesha123@gmail.com",
    "password": "12345678@"
}

#output
{
    "success": true,
    "message": "User registered successfully"
}


###Login
http://localhost:4000/api/auth/login
{
    "email": "shenoriruwesha123@gmail.com",
    "password": "12345678@"
}

#output
{
    "success": true,
    "message": "Login successful. Welcome email sent!"
}


###Logout
http://localhost:4000/api/auth/logout

#output
{
    "success": true,
    "message": "Logged out successfully"
}


###send-verify-otp
http://localhost:4000/api/auth/send-verify-otp

#output
{
    "success": true,
    "message": "Verification OTP sent on Email."
}


###verify-account
http://localhost:4000/api/auth/verify-account

{
    "otp": "375168"
}

#output
{
    "success": true,
    "message": "Email verified successfully."
}


###is-auth
http://localhost:4000/api/auth/is-auth

#output
{
    "success": true
}


###send-reset-otp
http://localhost:4000/api/auth/send-reset-otp

{
    "email": "shenoriperera87@gmail.com"
}

#output
{
    "success": true,
    "message": "OTP sent to your email"
}




