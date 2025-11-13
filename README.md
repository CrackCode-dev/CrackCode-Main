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


###

