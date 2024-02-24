import { emailTransporter } from '../constants';

type EmailVerificationEmailType = {
  email: string;
  id: string;
  name: string;
  randomString: string;
};

async function sendEmailVerification({
  email,
  id,
  name,
  randomString,
}: EmailVerificationEmailType) {
  try {
    const message = await emailTransporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_ADDRESS}>`,
      to: email,
      subject: `${process.env.SITE_NAME} - Verify your email address`,
      html: `
        <p>Hi, <b>${name}.</b> Thanks for joining.</p>
        <p>Please visit this <a href="${process.env.WEB_URL}/user/verify-email/${id}?token=${randomString}" target="_blank" rel="noreferrer">link</a> to verify your email address</p>
      `,
    });

    return message;
  } catch (err) {
    console.error(err);

    return null;
  }
}

type EmailVerifiedEmailType = {
  email: string;
  name: string;
};

async function sendEmailVerified({ email, name }: EmailVerifiedEmailType) {
  try {
    const message = await emailTransporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_ADDRESS}>`,
      to: email,
      subject: `${process.env.SITE_NAME} - Verify your email address`,
      html: `
        <p>Hi, <b>${name}.</b> Thanks for verifying your email address.</p>
      `,
    });

    return message;
  } catch (err) {
    console.error(err);

    return null;
  }
}

const emailService = {
  sendEmailVerification,
  sendEmailVerified,
};

export default emailService;
