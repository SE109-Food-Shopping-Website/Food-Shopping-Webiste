// app/admin/layout.tsx
import { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Receipt, Ticket } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="h-full w-full bg-white flex-col justify-start items-start inline-flex overflow-hidden">
      {/* Heading */}
      <div className="w-full h-14 px-[30px] py-2.5 bg-white border-b border-black/20 justify-between items-center inline-flex overflow-hidden">
        {/* Left */}
        <div className="h-[60px] justify-start items-center gap-5 inline-flex">
          <img className="w-[120px] h-[40px]" src="/logo_left.png" alt="logo" />
          <div className="text-[#fb4141] text-[20px] font-bold font-['Inter']">
            KÊNH NGƯỜI BÁN
          </div>
        </div>
        {/* Right */}
        <div className="h-[40px] justify-start items-center gap-[30px] inline-flex">
          <div className="w-[130px] self-stretch justify-start items-center gap-2.5 flex">
            <img className="grow shrink basis-0 self-stretch" src="/ava.png" />
            <div className="w-[100px] text-center text-black text-[16px] font-normal font-['Inter'] whitespace-nowrap flex items-center justify-center">
              Ngoc Minh
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M16 10L12 14L8 10"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Đăng xuất</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Body */}
      <div className="w-full h-full justify-start items-start inline-flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-[250px] h-full px-[30px] py-[20px] bg-white border-r border-black/20 flex justify-start items-start gap-[20px] overflow-y-auto overflow-x-hidden">
          <Accordion type="multiple" className="w-full">
            <div className="h-[30px] justify-start items-center gap-5 inline-flex">
              <div className="grow shrink basis-0 text-[#afafaf] text-base font-normal font-['Inter']">
                Trung tâm
              </div>
            </div>
            {/* Thống kê */}
            <AccordionItem value="thongke" className="w-full">
              <div className="w-full h-[30px] justify-between items-center inline-flex">
                <AccordionTrigger>
                  <div data-svg-wrapper className="relative">
                    <svg
                      className="mr-2"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 20V11H4.59961C4.03956 11 3.75981 11 3.5459 11.109C3.35774 11.2049 3.20487 11.3579 3.10899 11.546C3 11.7599 3 12.0399 3 12.6V20H9ZM9 20H15M9 20V5.59998C9 5.03992 9 4.75993 9.10899 4.54602C9.20487 4.35786 9.35774 4.20487 9.5459 4.10899C9.75981 4 10.0396 4 10.5996 4H13.3996C13.9597 4 14.2405 4 14.4544 4.10899C14.6425 4.20487 14.7948 4.35786 14.8906 4.54602C14.9996 4.75993 15 5.03992 15 5.59998V20M15 20L21 20V9.59998C21 9.03992 20.9996 8.75993 20.8906 8.54602C20.7948 8.35786 20.6425 8.20487 20.4544 8.10899C20.2405 8 19.9601 8 19.4 8H15V20Z"
                        stroke="#5CB338"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  Thống kê
                </AccordionTrigger>
              </div>
              <AccordionContent className="w-full">
                <Link
                  href="/admin/statics"
                  className="block w-full py-2 px-2 text-black hover:bg-gray-200"
                >
                  Doanh thu
                </Link>
              </AccordionContent>{" "}
            </AccordionItem>
            {/* Quản lý */}
            <AccordionItem value="quanly" className="w-full mb-[10px]">
              <div className="h-[30px] justify-between items-center inline-flex">
                <AccordionTrigger>
                  <div data-svg-wrapper className="relative">
                    <svg
                      className="mr-2"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 17V11.4521V11.4513C20 10.9175 20 10.6505 19.9351 10.4019C19.8775 10.1816 19.7827 9.97263 19.6548 9.7842C19.5104 9.57158 19.3096 9.39569 18.9074 9.04383L14.1074 4.84383C13.3608 4.19054 12.9875 3.86394 12.5674 3.7397C12.1972 3.63022 11.8028 3.63022 11.4326 3.7397C11.0127 3.86387 10.6398 4.19019 9.894 4.84275L9.89278 4.84383L5.09277 9.04383L5.09182 9.04466C4.69032 9.39597 4.48944 9.57174 4.34521 9.7842C4.2173 9.97263 4.12255 10.1816 4.06497 10.4019C4 10.6506 4 10.9178 4 11.4521V17C4 17.9319 4 18.3978 4.15224 18.7653C4.35523 19.2554 4.74481 19.6447 5.23486 19.8477C5.60241 20 6.06835 20 7.00023 20C7.93211 20 8.39782 20 8.76537 19.8477C9.25542 19.6447 9.64467 19.2554 9.84766 18.7653C9.9999 18.3978 10 17.9318 10 17V16C10 14.8954 10.8954 14 12 14C13.1046 14 14 14.8954 14 16V17C14 17.9318 14 18.3978 14.1522 18.7653C14.3552 19.2554 14.7448 19.6447 15.2349 19.8477C15.6024 20 16.0683 20 17.0002 20C17.9321 20 18.3978 20 18.7654 19.8477C19.2554 19.6447 19.6447 19.2554 19.8477 18.7653C19.9999 18.3978 20 17.9319 20 17Z"
                        stroke="#FB4141"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  Quản lý
                </AccordionTrigger>
              </div>
              <AccordionContent className="w-full">
                <Link
                  href="/admin/manage/provider"
                  className="block w-full py-2 px-2 text-black hover:bg-gray-200"
                >
                  Nhà cung cấp
                </Link>
              </AccordionContent>
              <AccordionContent className="w-full">
                <Link
                  href="/admin/manage/category"
                  className="block w-full py-2 px-2 text-black hover:bg-gray-200"
                >
                  Loại sản phẩm
                </Link>
              </AccordionContent>
              <AccordionContent className="w-full">
                <Link
                  href="/admin/manage/product"
                  className="block w-full py-2 px-2 text-black hover:bg-gray-200"
                >
                  Sản phẩm
                </Link>
              </AccordionContent>{" "}
              <AccordionContent className="w-full">
                <Link
                  href="/admin/manage/import"
                  className="block w-full py-2 px-2 text-black hover:bg-gray-200"
                >
                  Nhập hàng
                </Link>
              </AccordionContent>{" "}
            </AccordionItem>

            {/* Đơn hàng */}
            <div className="h-[30px] justify-start items-center gap-5 inline-flex">
              <div className="grow shrink basis-0 text-[#afafaf] text-base font-normal font-['Inter']">
                Đơn hàng
              </div>
            </div>
            <AccordionItem value="donhang">
              <div className="h-[30px] justify-between items-center inline-flex">
                <AccordionTrigger>
                  <div data-svg-wrapper className="relative">
                    <Receipt color="#5CB338" />
                  </div>
                  Đơn hàng
                </AccordionTrigger>
              </div>
              <AccordionContent className="w-full">
                <Link
                  href="/admin/order/prepared"
                  className="block w-full py-2 px-2 text-black hover:bg-gray-200"
                >
                  Đã soạn
                </Link>
              </AccordionContent>{" "}
              <AccordionContent className="w-full">
                <Link
                  href="/admin/order/unprepared"
                  className="block w-full py-2 px-2 text-black hover:bg-gray-200"
                >
                  Chưa soạn
                </Link>
              </AccordionContent>{" "}
              <AccordionContent className="w-full">
                <Link
                  href="/admin/order/returned"
                  className="block w-full py-2 px-2 text-black hover:bg-gray-200"
                >
                  Bị trả hàng
                </Link>
              </AccordionContent>{" "}
              <AccordionContent className="w-full">
                <Link
                  href="/admin/order"
                  className="block w-full py-2 px-2 text-black hover:bg-gray-200"
                >
                  Danh sách đơn
                </Link>
              </AccordionContent>{" "}
            </AccordionItem>

            {/* Khuyến mãi */}
            <AccordionItem value="khuyenmai" className="w-full mb-[10px]">
              <div className="h-[30px] justify-between items-center inline-flex">
                <AccordionTrigger>
                  <div data-svg-wrapper className="relative">
                    <Ticket color="#fb4141" />
                  </div>
                  Khuyến mãi
                </AccordionTrigger>
              </div>
              <AccordionContent className="w-full">
                <Link
                  href="/admin/promotion"
                  className="block w-full py-2 px-2 text-black hover:bg-gray-200"
                >
                  Danh sách đơn
                </Link>
              </AccordionContent>{" "}
              <AccordionContent className="w-full">
                <Link
                  href="/admin/promotion/point"
                  className="block w-full py-2 px-2 text-black hover:bg-gray-200"
                >
                  Tích điểm
                </Link>
              </AccordionContent>{" "}
            </AccordionItem>

            {/* Góp ý */}
            <div className="h-[30px] justify-start items-center gap-5 inline-flex">
              <div className="grow shrink basis-0 text-[#afafaf] text-base font-normal font-['Inter']">
                Góp ý
              </div>
            </div>
            <AccordionItem value="khachhang" className="w-full">
              <div className="w-full h-[30px] justify-between items-center inline-flex">
                <AccordionTrigger>
                  <div data-svg-wrapper className="relative">
                    <svg
                      className="mr-2"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17 20C17 18.3431 14.7614 17 12 17C9.23858 17 7 18.3431 7 20M21 16.9999C21 15.7697 19.7659 14.7124 18 14.2495M3 16.9999C3 15.7697 4.2341 14.7124 6 14.2495M18 10.2361C18.6137 9.68679 19 8.8885 19 8C19 6.34315 17.6569 5 16 5C15.2316 5 14.5308 5.28885 14 5.76389M6 10.2361C5.38625 9.68679 5 8.8885 5 8C5 6.34315 6.34315 5 8 5C8.76835 5 9.46924 5.28885 10 5.76389M12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11C15 12.6569 13.6569 14 12 14Z"
                        stroke="#5CB338"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  Khách hàng
                </AccordionTrigger>
              </div>
              <AccordionContent className="w-full">
                <Link
                  href="/admin/customer"
                  className="block w-full py-2 px-2 text-black hover:bg-gray-200"
                >
                  Danh sách
                </Link>
              </AccordionContent>{" "}
              <AccordionContent className="w-full">
                <Link
                  href="/admin/customer/comment"
                  className="block w-full py-2 px-2 text-black hover:bg-gray-200"
                >
                  Góp ý
                </Link>
              </AccordionContent>{" "}
            </AccordionItem>
          </Accordion>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-white h-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
