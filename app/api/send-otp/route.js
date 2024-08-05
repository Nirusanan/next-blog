import nodemailer from 'nodemailer';

export async function POST(req) {

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return new Response(JSON.stringify({ message: 'Email and OTP are required' }), { status: 400 });
    }

    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let mailOptions = {
      from: `"AI Blog" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
      html: `<p>Your OTP code is <strong>${otp}</strong></p>`,
    };

    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ message: 'OTP sent successfully' }), { 
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*' }, 
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return new Response(JSON.stringify({ message: 'Error sending OTP' }), { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}
