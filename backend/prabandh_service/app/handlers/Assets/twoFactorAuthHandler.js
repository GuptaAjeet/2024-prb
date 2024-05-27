const qrcode = require('qrcode');
const crypto = require('crypto');
const otpauth = require('otpauth');
const base32 = require("hi-base32");
const Model = require("../../models").AdminUser;
const Exception = require("../Assets/ExceptionHandler");
const Helper = require("../../helpers/Helper");
const Message = require("../../helpers/Message");
const UserLog = require("../Logs/UserLogHandler");
const { Crypto } = require("../../libraries");
const ApiLog = require("../Logs/ApiLogHandler");

const generateBase32Secret = () => {
    const buffer = crypto.randomBytes(15);
    const secret = base32.encode(buffer).replace(/=/g, "").substring(0, 24);
    return secret;
};

const generateOTPAuthURL = (issuerName, username, secret = null) => {
    const options = {
        algorithm: 'sha256', // Algorithm used for hashing (optional, defaults to sha1)
        digits: 6, // Number of digits in the OTP (optional, defaults to 6)
        issuer: issuerName, // Issuer name for display in Google Authenticator
        label: username,
        secret: secret !== null && secret.trim().length !== 0 ? secret : generateBase32Secret() // User label for display in Google Authenticator (optional)
    };

    const totp = new otpauth.TOTP({ ...options });
    const otpauthUrl = otpauth.URI.stringify(totp);
    return new Promise((resolve, reject) => {
        qrcode.toDataURL(otpauthUrl, (err, url) => {
            if (err) {
                reject(err);
            } else {
                resolve({ url, secret: options.secret });
            }
        });
    });
}

const enableTwoFactorAuthentication = async (secret, id) => {
    try {
        let result = await Model.update({ token_secret: secret, two_fa_enabled: 1 }, id)

        return ({ message: '2FA verification enabled' });
    } catch (e) {
        return (e);
    }
}

exports.generateQRCode = async (req, res) => {
    try {
        const { username, id } = req.body;

        const data = await Model.findOneUser({ id });

        if (Object.keys(data).length === 0) {
            return res.status(401).json({ message: 'Invalid user' });
        }

        let result = await generateOTPAuthURL("Prabandh", username, secret = Object.keys(data).length === 0 ? null : data?.token_secret)

        return res.status(200).json({ url: result.url, message: '2FA verification required', secret: Object.keys(data).length === 0 || !data?.token_secret ? result.secret : data?.token_secret });
    } catch (e) {
        return Exception.handle(e, res, req, "generateQRCode");
    }
};

exports.verifyOTP = async (req, res) => {
    const { username, token, secret, id } = req.body;

    try {
        const options = {
            algorithm: 'sha256', // Algorithm used for hashing (optional, defaults to sha1)
            digits: 6, // Number of digits in the OTP (optional, defaults to 6)
            issuer: "Prabandh", // Issuer name for display in Google Authenticator
            label: username,
            secret: secret,
        };

        const totp = new otpauth.TOTP(options);
        const verificationResult = totp.validate({ token, window: 2 });

        // verificationResult will be:
        // - null: If the token is invalid
        // - positive integer: The delta (difference) between the current counter and the counter used to generate the token. A delta of 0 indicates a valid token.

        if (verificationResult !== null) {
            if (req.body.two_fa_enabled && +req.body.two_fa_enabled === 1) {
                let result = await enableTwoFactorAuthentication(secret, id);
            }

            return res.json({ result: '1', message: +req.body.two_fa_enabled === 1 ? 'Two Factor Authentication enabled' : 'Login successful' });
        } else {
            return res.json({ result: '2', message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return Exception.handle(error, res, req, "verifyOTP");
    }
};

exports.disable2FA = async (req, res) => {
    try {
        const { id } = req.body;

        const data = await Model.update({ two_fa_enabled: 0 }, id)

        return res.status(200).json({ message: 'Two Factor Authentication disabled.' });
    } catch (e) {
        return Exception.handle(e, res, req, "disable2FA");
    }
};

exports.checkTwoFAEnabled = async (req, res) => {
    try {
        const { mobile } = req.body;
        const data = await Model.findOneUser({ user_mobile: mobile });

        console.log("sssss", data);

        if(data && Object.keys(data).length > 0){
            return res.status(200).json({ two_fa_enabled: data.two_fa_enabled })
        }
        else{
            return res.status(200).json({ message: 'Mobile number not found.' })
        }
        
    } catch (e) {
        return Exception.handle(e, res, req, "checkTwoFAEnabled");
    }
}

exports.otpBasedLogin = async (req, res) => {
    try {
        const { mobile, token, flag } = req.body;

        const data = await Model.findOneUser({ user_mobile: mobile });

        try {
            const options = {
                algorithm: 'sha256', // Algorithm used for hashing (optional, defaults to sha1)
                digits: 6, // Number of digits in the OTP (optional, defaults to 6)
                issuer: "Prabandh", // Issuer name for display in Google Authenticator
                label: data.user_name.trim().replace(/\s/g, "_").toLowerCase(),
                secret: data.token_secret,
            };

            const totp = new otpauth.TOTP(options);
            const verificationResult = totp.validate({ token, window: 2 });

            if (verificationResult !== null) {
                if (flag === "admin") {
                    let user = await Model.findOne({ user_mobile: mobile });

                    if (user?.user_role_id === 1 && user?.reference_user_id > 0) {
                        const userdata = await Model.findOne({ "u.id": user?.reference_user_id });
                        return loginResponses(userdata, req, res, "admin", user?.id);
                    } else {
                        return loginResponse(user, req, res, "admin");
                    }
                }
                return res.json({ result: '1', message: 'Login successful' });
            } else {
                return res.json({ result: '2', message: 'Invalid OTP' });
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            return Exception.handle(error, res, req, "otpBasedLogin");
        }
    } catch (e) {
        return Exception.handle(e, res, req, "otpBasedLogin");
    }
}

const loginResponses = (user, req, res, flag, id) => {
    if (user != null) {
        const session = Crypto.encrypt(user.id);
        const object = {
            status: true,
            token: Helper.token(req, user, session, flag),
            check: req.body.check,
        };
        UserLog.handle(req, res, user, session, flag);
        const objects = { valid_otp_time: null };
        Model.update({ ...ApiLog.objects }, id);
        return res.status(200).json(object);
    } else {
        const object = { status: false, message: Message.invalidLogin() };
        UserLog.handle(req, res, user, null, flag);
        return res.status(200).json(object);
    }
}

const loginResponse = (user, req, res, flag) => {
    if (user != null) {
        const session = Crypto.encrypt(user.id);
        const object = {
            status: true,
            token: Helper.token(req, user, session, flag),
            check: req.body.check,
        };
        UserLog.handle(req, res, user, session, flag);
        const objects = { valid_otp_time: null };
        Model.update(objects, user.id);
        return res.status(200).json(object);
    } else {
        const object = { status: false, message: Message.invalidLogin() };
        UserLog.handle(req, res, user, null, flag);
        return res.status(200).json(object);
    }
}