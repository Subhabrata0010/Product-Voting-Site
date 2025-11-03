const Admin = require("../models/admin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createAccessToken = (id, name, username, contact, email, profileURL, isAdmin) => {
    return jwt.sign(
        { id, name, username, contact, email, isAdmin, profileURL },
        process.env.ACCESS_TOKEN_KEY,
        { expiresIn: '1d' }
    );
};

const createRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN_KEY, { expiresIn: '7d' });
};

const createAccount = async (req, res) => {
    try {
        const { name, username, email, contact, password, profileURL } = req.body;

        if ([name, username, email, password, contact].some(
            (field) => typeof field !== "string" || field.trim() === ""
        )) {
            return res.status(400).json({ success: false, message: "insufficient data" });
        }

        const findAdmin = await Admin.findOne({ username });
        if (findAdmin) {
            return res.status(402).json({ success: false, message: "admin already exists" });
        }

        const hashedPass = await bcrypt.hash(password, 12);

        await Admin.create({
            name, email, username, contact, profileURL,
            password: hashedPass,
        });

        return res.status(200).json({ success: true, message: "admin account created" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "something went wrong" });
    }
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email?.trim() || !password?.trim()) {
            return res.status(400).json({ success: false, message: "insufficient data" });
        }

        const findAdmin = await Admin.findOne({ email }).select("password");
        if (!findAdmin) {
            return res.status(404).json({ success: false, message: "admin not exists" });
        }

        const isPassCorrect = await bcrypt.compare(password, findAdmin.password);
        if (!isPassCorrect) {
            return res.status(403).json({ success: false, message: "incorrect password" });
        }

        const accessToken = createAccessToken(
            findAdmin._id,
            findAdmin.name,
            findAdmin.username,
            findAdmin.contact,
            findAdmin.email,
            findAdmin.profileURL,
            findAdmin.isAdmin
        );

        const refreshToken = createRefreshToken(findAdmin._id);
        await Admin.updateOne({ email }, { refreshToken });

        const admin = await Admin.findById(findAdmin._id).select("-password -refreshToken");

        return res
            .status(200)
            .cookie("accessToken", accessToken, {
                maxAge: 60 * 60 * 1000 * 24 * 1,
                secure: true,
                httpOnly: true,
                sameSite: 'none'
            })
            .cookie("refreshToken", refreshToken, {
                maxAge: 60 * 60 * 1000 * 24 * 7,
                secure: true,
                httpOnly: true,
                sameSite: 'none'
            })
            .json({ success: true, message: "admin logged in successfully", admin });
    } catch (error) {
        return res.status(500).json({ success: false, message: "something went wrong", error: error.message });
    }
};

const getAdmin = async (req, res) => {
    try {
        const admin = req.admin;
        return res.status(200).json({ success: true, message: "admin found", admin });
    } catch (error) {
        return res.status(500).json({ success: false, message: "internal server error" });
    }
};

const adminLogout = async (req, res) => {
    req.admin = null;
    return res
        .status(201)
        .cookie("accessToken", "", { maxAge: 0, secure: true, httpOnly: true, sameSite: 'none' })
        .cookie("refreshToken", "", { maxAge: 0, secure: true, httpOnly: true, sameSite: 'none' })
        .json({ success: true, message: 'admin logged out successfully' });
};

const getAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(400).json({ success: false, message: "unauthorized request" });
        }

        const decode = jwt.decode(refreshToken, process.env.REFRESH_TOKEN_KEY);
        const admin = await Admin.findById(decode.id);

        if (!admin || refreshToken !== admin.refreshToken) {
            return res.status(401).json({ success: false, message: "invalid tokens" });
        }

        const accessToken = createAccessToken(
            admin._id, admin.name, admin.username, admin.contact,
            admin.email, admin.profileURL, admin.isAdmin
        );
        const newRefreshToken = createRefreshToken(admin._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, {
                maxAge: 60 * 60 * 1000 * 24 * 1,
                secure: true, httpOnly: true, sameSite: 'none'
            })
            .cookie("refreshToken", newRefreshToken, {
                maxAge: 60 * 60 * 1000 * 24 * 7,
                secure: true, httpOnly: true, sameSite: 'none'
            })
            .json({ success: true, message: "accesstoken generated", accessToken, refreshToken: newRefreshToken });
    } catch (error) {
        return res.status(500).json({ success: false, message: "internal server error" });
    }
};

module.exports = { createAccount, adminLogin, getAdmin, getAccessToken, adminLogout };