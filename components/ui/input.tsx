import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="w-[500px] h-[40px] p-5 rounded-[5px] border border-[#5CB338] justify-start items-center inline-flex overflow-hidden">
        <input
          type={type}
          className={cn(
            "w-full grow shrink basis-0 text-black placeholder:text-[#CCCCCC] text-base font-normal bg-transparent outline-none",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
