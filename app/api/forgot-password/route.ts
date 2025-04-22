import { NextRequest, NextResponse } from 'next/server';
import { setCode } from '@/lib/resetCodeStore';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: 'Missing email' }, { status: 400 });
  }

  // Tạo mã 4 chữ số và thời gian hết hạn sau 5 phút
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;
  setCode(email, code, expiresAt);

  // Cấu hình transporter với App Password
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // dùng SSL
    auth: {
      user: 'trandinhphuonglinh4@gmail.com',
      pass: 'suwbnrkuglsddygg', // bỏ khoảng trắng đi
    },
  });

  // Thông tin email gửi đi
  const mailOptions = {
    from: 'GoGreen <trandinhphuonglinh4@gmail.com>',
    to: email,
    subject: 'Mã xác thực khôi phục mật khẩu',
    text: `Mã xác thực của bạn là: ${code}.\nMã sẽ hết hạn sau 5 phút.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Sent verification code!' });
  } catch (err) {
    console.error('SendMail error:', err);
    return NextResponse.json({ message: 'Email send failed' }, { status: 500 });
  }
}
