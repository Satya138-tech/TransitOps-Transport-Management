const { registerUser,loginUser } = require('../services/auth.service')


const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/"
};

const register = async(req,res)=>{
    const {name,email,password,phone,role}= req.body;
    try{
        const {user,token} = await registerUser({name,email,password,phone,role});

        res.cookie("token",token,cookieOptions)

        res.status(201).json({
            'success':true,
            'message':'User registered successfully',
            'data':{
                user,
            }
        })
    }
    catch(error){
        if(error.message == 'Name, email, and password are required'){
            return res.status(400).json({
                'success':false,
                'message':error.message
            })
        }
        if(error.message === 'User already exists'){
           return res.status(409).json({
                'success':false,
                'message':error.message
            })
        }
        return res.status(500).json({
            'success':false,    
            'message':error.message || 'Internal Server Error'  
        })
    }
}

const login = async(req,res)=>{
    const {email,password} = req.body;
    try{
        const  {user,token} = await loginUser(email,password);

        res.cookie("token",token,cookieOptions)

        res.status(200).json({
            'success':true,
            'message':'User logged in successfully',
            'data':{
                user,
            }
        })
    }
    catch(error){
        if(error.message === 'Email and password are required'){
            return res.status(400).json({
                'success':false,
                'message':error.message
            })
        }
        if(error.message === 'Invalid email or password'){
            return res.status(401).json({
                'success':false,
                'message':error.message
            })
        }
        return res.status(500).json({
            'success':false,
            'message':error.message || 'Internal Server Error'
        })

    }
}


const logout = async(req,res)=>{
    try{
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none"
        });
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    }catch{
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const getProfile = async(req,res)=>{

    res.status(200).json({
        success:true,
        user:req.user
    });

};

const auth = async (req, res) => {
    const { mode, email, password, role } = req.body;
    try {
        if (!mode) {
            return res.status(400).json({ message: 'Mode (login or signup) is required' });
        }
        
        if (mode === 'signup') {
            const { user, token } = await registerUser({ email, password, role });
            res.cookie("token", token, cookieOptions);
            return res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role
                }
            });
        } else if (mode === 'login') {
            const { user, token } = await loginUser(email, password);
            res.cookie("token", token, cookieOptions);
            return res.status(200).json({
                message: 'User logged in successfully',
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            return res.status(400).json({ message: 'Invalid authentication mode' });
        }
    } catch (error) {
        let statusCode = 500;
        if (error.message.includes('required')) {
            statusCode = 400;
        } else if (error.message === 'User already exists') {
            statusCode = 409;
        } else if (error.message === 'Invalid email or password') {
            statusCode = 401;
        }
        return res.status(statusCode).json({
            message: error.message || 'Internal Server Error'
        });
    }
};

module.exports = {
    register,
    login,
    logout,
    getProfile,
    auth
}