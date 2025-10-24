"use client";

import { useState } from "react";
import { Button } from "./button";
import { Calendar } from "lucide-react";

interface DatePickerProps {
  startDate?: Date;
  endDate?: Date;
  onApply: (startDate: Date, endDate: Date) => void;
}

export function DatePicker({ startDate, endDate, onApply }: DatePickerProps) {
  const [start, setStart] = useState(startDate || new Date());
  const [end, setEnd] = useState(endDate || new Date());

  const handleApply = () => {
    onApply(start, end);
  };

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatTimeForInput = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    newDate.setHours(start.getHours(), start.getMinutes());
    setStart(newDate);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":");
    const newDate = new Date(start);
    newDate.setHours(parseInt(hours), parseInt(minutes));
    setStart(newDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    newDate.setHours(end.getHours(), end.getMinutes());
    setEnd(newDate);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":");
    const newDate = new Date(end);
    newDate.setHours(parseInt(hours), parseInt(minutes));
    setEnd(newDate);
  };

  return (
    <div className="p-4 space-y-4 w-[280px]">
      {/* Start Date/Time */}
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground font-medium">
          Start
        </label>
        <div className="flex gap-2">
          <input
            type="date"
            value={formatDateForInput(start)}
            onChange={handleStartDateChange}
            className="flex-1 h-8 px-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-gray-400 focus:ring-2"
          />
          <input
            type="time"
            value={formatTimeForInput(start)}
            onChange={handleStartTimeChange}
            className="w-[90px] h-8 px-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-gray-400 focus:ring-2"
          />
        </div>
      </div>

      {/* End Date/Time */}
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground font-medium">End</label>
        <div className="flex gap-2">
          <input
            type="date"
            value={formatDateForInput(end)}
            onChange={handleEndDateChange}
            className="flex-1 h-8 px-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-gray-400 focus:ring-2"
          />
          <input
            type="time"
            value={formatTimeForInput(end)}
            onChange={handleEndTimeChange}
            className="w-[90px] h-8 px-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-gray-400 focus:ring-2"
          />
        </div>
      </div>

      {/* Apply Button */}
      <Button
        onClick={handleApply}
        variant="outline"
        className="w-full relative h-8 text-sm"
      >
        Apply
        <span className="text-xs mt-1">↵</span>
      </Button>
    </div>
  );
}
