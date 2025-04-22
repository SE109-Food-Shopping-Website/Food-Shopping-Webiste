import { NextRequest, NextResponse } from 'next/server';
import { deleteCode } from '@/lib/resetCodeStore';
import { prisma } from '@/lib/prisma'; // Đảm bảo đường dẫn đúng

export async function POST(req: NextRequest) {
  const { email, newPassword } = await req.json();

  // Kiểm tra xem người dùng có tồn tại không
  const user = await prisma.uSER.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  // Cập nhật mật khẩu mới (hàm hash nên được thêm vào nếu muốn bảo mật hơn)
  await prisma.uSER.update({
    where: { email },
    data: { password: newPassword },
  });

  // Xóa mã xác minh
  deleteCode(email);

  return NextResponse.json({ message: 'Password reset successful!' });
}
