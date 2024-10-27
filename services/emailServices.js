const path = require('path')
const fs = require('fs')

const transporter = require('../configuration/smtpConfig')

const sendOtpThroughEmail = (to, otp) => {
    try{
        const templatePath = path.join(__dirname, '../templates/otpTemplate.html')
        let htmlContent = fs.readFileSync(templatePath, 'utf8')

        htmlContent = htmlContent.replace('${otp}', otp)

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: 'Your OTP Code',
            html: htmlContent,
            attachments: [
                {
                    filename: 'logo.png',
                    path: path.join(
                        __dirname,
                        '../assets/images/logo.png'
                    ),
                    cid: 'image1',
                },
            ],
        }

        return transporter.sendMail(mailOptions)
    }
    catch(error) {
        throw new Error(error)
    }
    
}

module.exports = {
    sendOtpThroughEmail,
}