const { HOMEPAGE } = require("../utils/apiRoutes");

const config = {
  welcome: `<!DOCTYPE html>
    <html>
    <head>
        <title>Welcome Onboard!</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; margin-top: 20px;">
            <tr>
                <td align="center" bgcolor="#0265ac" style="padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                    Welcome to Pipelines!
                </td>
            </tr>
            <tr>
                <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                <b>Hello, and welcome!</b>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                You've just taken the first step to streamline your career with our platform. Get ready to unlock all the features and benefits we offer. We're thrilled to have you on board.
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                If you have the secret code for alpha testing, please enter it by clicking the button below.
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 20px 0 30px 0;">
                                <a href="${HOMEPAGE}/code" style="padding: 10px 20px; font-size: 18px; font-weight: bold; color: #ffffff; background-color: #0265ac; text-decoration: none; border-radius: 5px;">Secret...</a>
                            </td>
                        </tr>
                        <tr>
                            <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px;">
                                If you have any questions or need assistance getting started, our support team is here to help. Reach out to us anytime at <a href="mailto:support@pipelines.lol" style="color: #0265ac;">support@pipelines.lol</a>.
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td bgcolor="#f4f4f4" style="padding: 30px 30px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td style="color: #999999; font-family: Arial, sans-serif; font-size: 12px; line-height: 18px;">
                                You're receiving this email because you recently subscribed to our newsletter. If you didn't sign up for this newsletter, please ignore this email.
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 20px 0 0 0;">
                                <table border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td align="center" style="font-family: Arial, sans-serif; font-size: 12px; color: #999999;">
                                            &copy; 2024 pipelines.lol. All rights reserved.
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>`,
};

module.exports = config;
