import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ value = '#000000', onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "w-10 h-10 rounded-md border",
          "cursor-pointer overflow-hidden"
        )}
      >
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4"
        />
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-mono uppercase"
        maxLength={7}
        placeholder="#000000"
      />
    </div>
  );
}