import nodemailer from "nodemailer";

// Email notifications are best-effort: if SMTP env vars are not configured,
// we log a warning and skip sending instead of breaking the request flow.
let transporter = null;

const isEmailConfigured = () =>
    process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS;

const getTransporter = () => {
    if (!isEmailConfigured()) return null;
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: Number(process.env.EMAIL_PORT) === 465,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }
    return transporter;
};

export const sendMail = async ({ to, subject, html }) => {
    try {
        const t = getTransporter();
        if (!t) {
            console.log(`[mailer] Skipped email "${subject}" to ${to} — EMAIL_HOST/EMAIL_USER/EMAIL_PASS not set in .env`);
            return { sent: false };
        }
        await t.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to,
            subject,
            html
        });
        return { sent: true };
    } catch (error) {
        console.error("[mailer] Failed to send email:", error.message);
        return { sent: false, error: error.message };
    }
};

export const welcomeEmailHtml = (name) => `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color:#1e293b;">Welcome to Imagify, ${name}! 🎉</h2>
        <p>Your account has been created successfully. You've received <b>5 free credits</b> to start generating AI images right away.</p>
        <p>You'll also get a small batch of free credits every day you log in.</p>
        <p style="color:#64748b; font-size: 13px;">— The Imagify Team</p>
    </div>
`;

export const paymentEmailHtml = (name, credits, amount, currency) => `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color:#1e293b;">Payment Successful ✅</h2>
        <p>Hi ${name}, your payment of <b>${amount} ${currency}</b> was successful.</p>
        <p><b>${credits}</b> credits have been added to your account.</p>
        <p style="color:#64748b; font-size: 13px;">— The Imagify Team</p>
    </div>
`;
