// src/lib/email/index.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const base = (content: string) => `
  <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #1a1209;">
    <h1 style="color: #d4832a; font-size: 28px; margin-bottom: 8px;">Lat Shop</h1>
    <hr style="border: 1px solid #f4dbb0; margin-bottom: 32px;" />
    ${content}
    <hr style="border: 1px solid #f4dbb0; margin-top: 32px;" />
    <p style="font-size: 12px; color: #b86820;">© ${new Date().getFullYear()} Lat Shop · Calgary, Canada</p>
  </div>
`;

// ── Welcome ──────────────────────────────────────────
export async function sendWelcomeEmail({ email, name }: { email: string; name: string }) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Welcome to Lat Shop 🎁",
    html: base(`
      <h2 style="font-size: 22px; font-weight: normal;">Welcome, ${name}! 🎉</h2>
      <p style="font-size: 16px; line-height: 1.6; color: #3d2b14;">
        Thank you for joining Lat Shop. Discover our handpicked collection of African gifts,
        jewelry and accessories — shipped from Calgary, Canada.
      </p>
      <p style="font-size: 16px; line-height: 1.6;">
        Use code <strong style="color: #d4832a;">WELCOME10</strong> for 10% off your first order.
      </p>
      <div style="text-align: center; margin: 40px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/shop"
          style="background: #d4832a; color: white; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-size: 16px;">
          Shop Now
        </a>
      </div>
    `),
  });
}

// ── Password Reset ───────────────────────────────────
export async function sendPasswordResetEmail({ email, name, resetUrl }: { email: string; name: string; resetUrl: string }) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset your Lat Shop password",
    html: base(`
      <h2 style="font-size: 22px; font-weight: normal;">Hi ${name},</h2>
      <p style="font-size: 16px; line-height: 1.6; color: #3d2b14;">
        We received a request to reset your password. Click below to choose a new one.
        This link expires in <strong>1 hour</strong>.
      </p>
      <div style="text-align: center; margin: 40px 0;">
        <a href="${resetUrl}" style="background: #d4832a; color: white; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-size: 16px;">
          Reset Password
        </a>
      </div>
      <p style="font-size: 14px; color: #7a3f1d;">If you didn't request this, you can safely ignore this email.</p>
    `),
  });
}

// ── Order Confirmation ───────────────────────────────
export async function sendOrderConfirmationEmail({ email, name, orderId, total }: { email: string; name: string; orderId: string; total: number }) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Order Confirmed — #${orderId.slice(-8).toUpperCase()}`,
    html: base(`
      <h2 style="font-size: 22px; font-weight: normal;">Thank you, ${name}! 🎉</h2>
      <p style="font-size: 16px; line-height: 1.6; color: #3d2b14;">
        Your order <strong>#${orderId.slice(-8).toUpperCase()}</strong> has been confirmed.<br/>
        Total paid: <strong style="color: #d4832a;">CA$${total.toFixed(2)}</strong>
      </p>
      <p style="font-size: 15px; color: #3d2b14;">
        We'll send you another email as soon as your order ships with a tracking number.
      </p>
      <div style="text-align: center; margin: 40px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders"
          style="background: #d4832a; color: white; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-size: 16px;">
          View Order
        </a>
      </div>
    `),
  });
}

// ── Shipping Notification ────────────────────────────  ← NEW
export async function sendShippingNotificationEmail({
  email, name, orderId, trackingNumber,
}: {
  email: string; name: string; orderId: string; trackingNumber?: string;
}) {
  const trackingSection = trackingNumber
    ? `
      <div style="background: #faefd9; border: 1px solid #ecc07f; border-radius: 8px; padding: 16px 20px; margin: 24px 0; text-align: center;">
        <p style="font-size: 13px; color: #7a3f1d; margin-bottom: 6px;">TRACKING NUMBER</p>
        <p style="font-family: monospace; font-size: 20px; color: #d4832a; letter-spacing: 2px; font-weight: bold;">${trackingNumber}</p>
        <a href="https://www.canadapost-postescanada.ca/track-reperer/alternate?execution=e1s1&lang=en&totalSearch=true&searchFor=${trackingNumber}"
          style="font-size: 13px; color: #b86820; display: inline-block; margin-top: 8px;">
          Track on Canada Post →
        </a>
      </div>
    `
    : `<p style="font-size: 15px; color: #3d2b14;">Your tracking number will be available on Canada Post soon.</p>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Your Order Has Shipped 🚚 — #${orderId.slice(-8).toUpperCase()}`,
    html: base(`
      <h2 style="font-size: 22px; font-weight: normal;">Your order is on its way, ${name}! 🚚</h2>
      <p style="font-size: 16px; line-height: 1.6; color: #3d2b14;">
        Great news — order <strong>#${orderId.slice(-8).toUpperCase()}</strong> has been shipped from Calgary.
      </p>
      ${trackingSection}
      <div style="text-align: center; margin: 32px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders"
          style="background: #d4832a; color: white; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-size: 16px;">
          View Order
        </a>
      </div>
    `),
  });
}
