// app/admin/layout.tsx
import { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="h-full w-full bg-white flex-col justify-start items-start inline-flex overflow-hidden">
      {/* Heading */}
      <div className="w-full h-15 px-[30px] py-2.5 bg-white border-b border-black/20 justify-between items-center inline-flex overflow-hidden">
        {/* Left */}
        <div className="h-[60px] justify-start items-center gap-5 inline-flex">
          <img className="w-[170px] h-[60px]" src="/logo_left.png" alt="logo" />
          <div className="text-[#fb4141] text-[24px] font-bold font-['Inter']">
            KÊNH NGƯỜI BÁN
          </div>
        </div>
        {/* Right */}
        <div className="h-[50px] justify-start items-center gap-[30px] inline-flex">
          <div className="w-[160px] self-stretch justify-start items-center gap-2.5 flex">
            <img className="grow shrink basis-0 self-stretch" src="/ava.png" />
            <div className="w-[100px] text-center text-black text-xl font-normal font-['Inter'] whitespace-nowrap flex items-center justify-center">
              Ngoc Minh
            </div>
          </div>
          <div data-svg-wrapper className="relative">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 9L12 16L5 9"
                stroke="black"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      {/* Body */}
      <div className="w-full h-full justify-start items-start inline-flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-[250px] h-full px-[30px] py-[20px] bg-white flex justify-start items-start gap-[20px] overflow-y-auto overflow-x-hidden">
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
                  href="/admin/statics/revenue"
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
                    <svg
                      className="mr-2"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.21799 7.09204L4.10899 7.54603L3.21799 7.09204ZM4.0918 6.21799L4.54579 7.10899L4.0918 6.21799ZM4.0918 17.782L4.54579 16.891H4.54579L4.0918 17.782ZM3.21799 16.908L2.32698 17.362H2.32698L3.21799 16.908ZM20.7822 16.908L19.8912 16.454L20.7822 16.908ZM19.9078 17.782L19.4538 16.891L19.9078 17.782ZM20.7822 7.09204L19.8912 7.54603V7.54603L20.7822 7.09204ZM19.9078 6.21799L20.3618 5.32698V5.32698L19.9078 6.21799ZM11 18C11 18.5523 11.4477 19 12 19C12.5523 19 13 18.5523 13 18H11ZM5 18C5 18.5523 5.44772 19 6 19C6.55228 19 7 18.5523 7 18H5ZM18 15C18.5523 15 19 14.5523 19 14C19 13.4477 18.5523 13 18 13V15ZM14 13C13.4477 13 13 13.4477 13 14C13 14.5523 13.4477 15 14 15V13ZM18 12C18.5523 12 19 11.5523 19 11C19 10.4477 18.5523 10 18 10V12ZM15 10C14.4477 10 14 10.4477 14 11C14 11.5523 14.4477 12 15 12V10ZM9 12C8.44772 12 8 11.5523 8 11H6C6 12.6569 7.34315 14 9 14V12ZM8 11C8 10.4477 8.44772 10 9 10V8C7.34315 8 6 9.34315 6 11H8ZM9 10C9.55228 10 10 10.4477 10 11H12C12 9.34315 10.6569 8 9 8V10ZM10 11C10 11.5523 9.55228 12 9 12V14C10.6569 14 12 12.6569 12 11H10ZM20 9.19995V14.8H22V9.19995H20ZM17.8002 17H6.2002V19H17.8002V17ZM4 14.8V9.19995H2V14.8H4ZM6.2002 7H17.8002V5H6.2002V7ZM4 9.19995C4 8.6234 4.00078 8.25114 4.02393 7.96783C4.04612 7.6962 4.0838 7.59549 4.10899 7.54603L2.32698 6.63805C2.13419 7.01642 2.06287 7.40961 2.03057 7.80495C1.99922 8.18861 2 8.6564 2 9.19995H4ZM6.2002 5C5.65663 5 5.18874 4.99922 4.80498 5.03057C4.40962 5.06286 4.01624 5.13416 3.63781 5.32698L4.54579 7.10899C4.59517 7.08383 4.69595 7.04613 4.9678 7.02393C5.25126 7.00078 5.62365 7 6.2002 7V5ZM4.10899 7.54603C4.205 7.35761 4.35788 7.20474 4.54579 7.10899L3.63781 5.32698C3.07306 5.61473 2.61447 6.07382 2.32698 6.63805L4.10899 7.54603ZM6.2002 17C5.62367 17 5.25127 16.9992 4.96782 16.9761C4.69598 16.9538 4.59519 16.9161 4.54579 16.891L3.63781 18.673C4.01623 18.8658 4.40959 18.9371 4.80496 18.9694C5.18873 19.0008 5.65662 19 6.2002 19V17ZM2 14.8C2 15.3435 1.99922 15.8113 2.03057 16.195C2.06287 16.5904 2.13418 16.9836 2.32698 17.362L4.10899 16.454C4.08381 16.4046 4.04613 16.3039 4.02393 16.0322C4.00078 15.7488 4 15.3765 4 14.8H2ZM4.54579 16.891C4.35778 16.7952 4.20494 16.6424 4.10899 16.454L2.32698 17.362C2.61452 17.9264 3.07317 18.3853 3.63781 18.673L4.54579 16.891ZM20 14.8C20 15.3766 19.9993 15.7489 19.9762 16.0323C19.954 16.3041 19.9163 16.4047 19.8912 16.454L21.6732 17.362C21.8661 16.9835 21.9373 16.5902 21.9696 16.1949C22.0008 15.8112 22 15.3434 22 14.8H20ZM17.8002 19C18.3438 19 18.8115 19.0008 19.1951 18.9694C19.5904 18.9371 19.9835 18.8657 20.3618 18.673L19.4538 16.891C19.4043 16.9162 19.3036 16.9539 19.0321 16.9761C18.7489 16.9992 18.3767 17 17.8002 17V19ZM19.8912 16.454C19.7956 16.6417 19.6425 16.7948 19.4538 16.891L20.3618 18.673C20.9257 18.3856 21.3854 17.927 21.6732 17.362L19.8912 16.454ZM22 9.19995C22 8.6565 22.0008 8.1887 21.9695 7.80511C21.9373 7.40983 21.8661 7.01653 21.6732 6.63805L19.8912 7.54603C19.9164 7.59537 19.954 7.69598 19.9762 7.96767C19.9993 8.25105 20 8.6233 20 9.19995H22ZM17.8002 7C18.3768 7 18.7489 7.00078 19.0321 7.02393C19.3036 7.04611 19.4043 7.08377 19.4538 7.10899L20.3618 5.32698C19.9835 5.13421 19.5904 5.06288 19.1951 5.03057C18.8115 4.99922 18.3437 5 17.8002 5V7ZM21.6732 6.63805C21.3854 6.07316 20.9259 5.61439 20.3618 5.32698L19.4538 7.10899C19.6424 7.20507 19.7956 7.35828 19.8912 7.54603L21.6732 6.63805ZM13 18C13 17.0093 12.3977 16.2349 11.676 15.7537C10.9474 15.268 9.99832 15 9 15V17C9.65854 17 10.2095 17.1798 10.5666 17.4178C10.9307 17.6606 11 17.8861 11 18H13ZM9 15C8.00168 15 7.05265 15.268 6.32398 15.7537C5.6023 16.2349 5 17.0093 5 18H7C7 17.8861 7.06927 17.6606 7.43338 17.4178C7.7905 17.1798 8.34146 17 9 17V15ZM18 13L14 13V15L18 15V13ZM18 10L15 10V12L18 12V10Z"
                        fill="#5CB338"
                      />
                    </svg>
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
                    <svg
                      className="mr-2"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17 21C17 18.2386 14.7614 16 12 16C9.23858 16 7 18.2386 7 21M12 13C10.3431 13 9 11.6569 9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10C15 11.6569 13.6569 13 12 13ZM21 6.19995V17.8C21 18.9201 21.0002 19.4802 20.7822 19.908C20.5905 20.2844 20.2841 20.5902 19.9078 20.782C19.48 21 18.9203 21 17.8002 21H6.2002C5.08009 21 4.51962 21 4.0918 20.782C3.71547 20.5902 3.40973 20.2844 3.21799 19.908C3 19.4802 3 18.9201 3 17.8V6.19995C3 5.07985 3 4.51986 3.21799 4.09204C3.40973 3.71572 3.71547 3.40973 4.0918 3.21799C4.51962 3 5.08009 3 6.2002 3H17.8002C18.9203 3 19.48 3 19.9078 3.21799C20.2841 3.40973 20.5905 3.71572 20.7822 4.09204C21.0002 4.51986 21 5.07985 21 6.19995Z"
                        stroke="#FB4141"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
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
        <main className="flex-1 p-6 bg-gray-100 h-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
