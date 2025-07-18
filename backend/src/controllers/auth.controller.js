import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import generateToken from '../lib/generateToken.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //Validation input
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Please fill all the fields' });
    }
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid email format' });
    }
    //Check if the user EXIST
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res
        .status(400)
        .json({ success: false, message: 'This user already exists..' });
    }
    //hash the password
    const hashedPass = await bcrypt.hash(password, 10);
    const profileImg = `https://api.dicebear.com/9.x/adventurer/svg?seed=${name}`;
    const user = new User({
      userName: name,
      email,
      password: hashedPass,
      profileImg,
    });
    await user.save();
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      user: {
        username: user.userName,
        email: user.email,
        profileImg,
      },
    });
  } catch (error) {
    console.log('Error in Register function', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid credential' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid credential' });
    }
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      message: 'User loged in successfully',
      token,
      user: {
        username: user.userName,
        email: user.email,
        profileImg: user.profileImg,
      },
    });
  } catch (error) {
    console.log('Error in Log in function', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
