import { ReactNode } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionTrigger,
    AccordionItem,
} from "@/components/ui/accordion";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Link } from "lucide-react";

interface ClientLayoutProps {
    children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    return (  
        <div className="h-full w-full bg-white flex-col jutify-start items-start inline-flex overflow-hidden">
            {/* Heading */}
            <div className="w-full h-15 px-[30px] py-2.5 bg-white border-b border-black/20 justify-between items-center inline-flex overflow-hidden">
                {/* Left */}
                <div className="h-[40px] justify-start items-center inline-flex gap-5">
                    <img className="w-[170px] h-[60px]" src="/logo_left.png" alt="Logo" />
                </div>
                {/* Between */}
                <div className="w-[600px] relative rounded-[10px] bg-white border-gray-400 border-solid border-[1px] box-border h-10 overflow-hidden shrink-0 flex flex-row items-center justify-start p-2.5 text-left text-[14px] text-black font-inter">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="w-[170px] flex justify-between items-center">
                            <span>Danh mục sản phẩm</span>
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
                        <DropdownMenuContent className="w-full" align="start">
                            <DropdownMenuItem>Rau</DropdownMenuItem>
                            <DropdownMenuItem>Sữa</DropdownMenuItem>
                            <DropdownMenuItem>Trứng</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div data-svg-wrapper className="divide">
                            <svg
                                className="mr-2"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"  
                            >
                                <path
                                    d="M12.8391 21V3"     
                                    stroke="gray"
                                    strokeOpacity="2"
                                    strokeWidth="2"
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                />               
                            </svg>
                        </div>
                        <div className="flex-1 h-[30px] flex flex-row items-center">
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm" 
                                className="w-full h-full px-2 text-[16px] text-black border-none outline-none"
                            />
                            <div className="w-[60px] relative rounded-[5px] bg-primary h-[30px] flex flex-row items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="white"
                                >
                                    <path
                                        d="M14.0462 11.7929C13.6557 11.4024 13.0225 11.4024 12.632 11.7929C12.2415 12.1834 12.2415 12.8166 12.632 13.2071L14.0462 11.7929ZM17.632 18.2071C18.0225 18.5976 18.6557 18.5976 19.0462 18.2071C19.4367 17.8166 19.4367 17.1834 19.0462 16.7929L17.632 18.2071ZM9.17244 13.1667C6.50307 13.1667 4.33911 11.0027 4.33911 8.33333H2.33911C2.33911 12.1073 5.3985 15.1667 9.17244 15.1667V13.1667ZM4.33911 8.33333C4.33911 5.66396 6.50307 3.5 9.17244 3.5V1.5C5.3985 1.5 2.33911 4.55939 2.33911 8.33333H4.33911ZM9.17244 3.5C11.8418 3.5 14.0058 5.66396 14.0058 8.33333H16.0058C16.0058 4.55939 12.9464 1.5 9.17244 1.5V3.5ZM14.0058 8.33333C14.0058 11.0027 11.8418 13.1667 9.17244 13.1667V15.1667C12.9464 15.1667 16.0058 12.1073 16.0058 8.33333H14.0058ZM12.632 13.2071L17.632 18.2071L19.0462 16.7929L14.0462 11.7929L12.632 13.2071Z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                {/* Right */}
                <div className="h-[50px] justify-end items-center inline-flex gap-5">
                        <div data-svg-wrapper className="profile">
                            <svg
                                className="mr-2"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"  
                            >
                                <path
                                    d="M18 19C18 16.7909 15.3137 15 12 15C8.68629 15 6 16.7909 6 19M12 12C9.79086 12 8 10.2091 8 8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8C16 10.2091 14.2091 12 12 12Z"     
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                />               
                            </svg>
                        </div>
                    <div data-svg-wrapper className="cart">
                        <svg
                            className="mr-2"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M3 3H3.26835C3.74213 3 3.97922 3 4.17246 3.08548C4.34283 3.16084 4.48871 3.2823 4.59375 3.43616C4.71289 3.61066 4.75578 3.84366 4.8418 4.30957L7.00004 16L17.4195 16C17.8739 16 18.1016 16 18.2896 15.9198C18.4554 15.8491 18.5989 15.7348 18.7051 15.5891C18.8255 15.424 18.8763 15.2025 18.9785 14.7597L20.5477 7.95972C20.7022 7.29025 20.7796 6.95561 20.6946 6.69263C20.6201 6.46207 20.4639 6.26634 20.256 6.14192C20.0189 6 19.6758 6 18.9887 6H5.5M18 21C17.4477 21 17 20.5523 17 20C17 19.4477 17.4477 19 18 19C18.5523 19 19 19.4477 19 20C19 20.5523 18.5523 21 18 21ZM8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20C9 20.5523 8.55228 21 8 21Z"
                                stroke="black"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <div data-svg-wrapper className="notification">
                        <svg
                            className="mr-2"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M2.33496 10.3368C2.02171 10.0471 2.19187 9.52338 2.61557 9.47314L8.61914 8.76134C8.79182 8.74086 8.94181 8.63206 9.01465 8.47416L11.5469 2.9843C11.7256 2.59686 12.2764 2.59681 12.4551 2.98425L14.9873 8.47424C15.0601 8.63214 15.2092 8.74087 15.3818 8.76135L21.3857 9.47314C21.8094 9.52338 21.9795 10.0471 21.6662 10.3368L17.2279 14.4415C17.1002 14.5596 17.0433 14.7356 17.0771 14.9061L18.2551 20.8359C18.3383 21.2544 17.8929 21.578 17.5206 21.3696L12.2453 18.4167C12.0935 18.3318 11.9087 18.3317 11.757 18.4166L6.48109 21.3697C6.10878 21.5781 5.66294 21.2545 5.74609 20.836L6.92437 14.9061C6.95826 14.7355 6.90134 14.5596 6.77367 14.4416L2.33496 10.3368Z"
                                stroke="black"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>
            </div>
            {/* Menu */}
            <div className="w-full relative bg-primary h-[50px] flex flex-row items-center justify-between py-0 px-[100px] box-border gap-0 text-left text-[16px] text-white font-inter">
                <b className="relative">TRANG CHỦ</b>
                <b className="relative">TẤT CẢ SẢN PHẨM</b>
                <b className="relative">KHUYẾN MÃI</b>
                <b className="relative">LỊCH SỬ MUA HÀNG</b>
                <b className="relative">ĐIỂM TÍCH LŨY</b>
            </div>
            {/* Main Content */}
            <main className="w-full flex-1 p-6 white h-full overflow-y-auto">
                {children}
            </main>
        </div>
    );
}