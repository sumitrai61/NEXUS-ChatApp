import jwt from 'jsonwebtoken'; //library for authentication tokens

export const generateToken = (userId,res) => {
    const token = jwt.sign({userId},process.env.JWT_SECRET, {
        expiresIn: '7d' //token will expire in 7 days
    })

    res.cookie("jwt",token,{
        maxAge: 7 * 24 * 60 * 60 * 1000, //cookie will expire in 7 days
        httpOnly: true, //prevent XSS attacks across the site scripting attacks
        sameSite:'strict', //CSRF attacks cross-site request forgery attcks
        secure: process.env.NODE_ENV !== 'development' //use secure cookies in development
    });
    
    return token; 
}