
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateRangeSelectorProps {
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
}

const DateRangeSelector = ({ onDateRangeChange }: DateRangeSelectorProps) => {
  const today = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(today.getMonth() - 3);
  
  const [startDate, setStartDate] = useState<Date | undefined>(threeMonthsAgo);
  const [endDate, setEndDate] = useState<Date | undefined>(today);

  const handleSearch = () => {
    if (startDate && endDate) {
      onDateRangeChange(startDate, endDate);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Rango de fechas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP", { locale: es }) : "Seleccione fecha inicio"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  disabled={(date) => date > today || (endDate ? date > endDate : false)}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP", { locale: es }) : "Seleccione fecha fin"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => date > today || (startDate ? date < startDate : false)}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <Button 
            onClick={handleSearch} 
            disabled={!startDate || !endDate}
            className="sm:w-auto"
          >
            Buscar XML
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateRangeSelector;
