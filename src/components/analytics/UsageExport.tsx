import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Download } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface UsageExportProps {
  onExport: (startDate: Date, endDate: Date) => Promise<void>;
}

export function UsageExport({ onExport }: UsageExportProps) {
  const [date, setDate] = useState<Date>();
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    if (!date) return;
    
    try {
      setLoading(true);
      const endDate = new Date();
      await onExport(date, endDate);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn(
            "justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "Pick a start date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      
      <Button 
        onClick={handleExport} 
        disabled={!date || loading}
      >
        <Download className="mr-2 h-4 w-4" />
        {loading ? 'Exporting...' : 'Export Usage Data'}
      </Button>
    </div>
  );
}