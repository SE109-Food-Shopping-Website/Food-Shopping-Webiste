import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
  cartQuantity: number;
  onChange: (newQuantity: number) => void;
}

export default function QuantitySelector({ cartQuantity, onChange }: QuantitySelectorProps) {
  return (
    <div className="flex items-center border rounded-sm px-2 py-0.5 w-[100px] h-[30px]">
      <Button 
        variant="ghost" 
        size="icon" 
        className="w-6 h-6 p-0 hover:bg-transparent focus:outline-none"
        onClick={() => onChange(Math.max(1, cartQuantity - 1))}
      >
        -
      </Button>
      <span className="mx-2 text-sm min-w-[20px] text-center">{cartQuantity}</span>
      <Button 
        variant="ghost" 
        size="icon" 
        className="w-6 h-6 p-0 hover:bg-transparent focus:outline-none"
        onClick={() => onChange(cartQuantity + 1)}
      >
        +
      </Button>
    </div>
  );
}