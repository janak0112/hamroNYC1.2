import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import { CalendarDays } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

// Format a Date -> 'YYYY-MM-DD' (no timezone surprises)
function formatYMD(d) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// A Tailwind-styled input the datepicker will render into
const TextInput = forwardRef(({ value, onClick, placeholder, error, id }, ref) => (
    <div className="relative w-full">
        <CalendarDays className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
        <input
            id={id}
            ref={ref}
            onClick={onClick}
            readOnly
            value={value || ""}
            placeholder="Pick a Date"
            className={`w-full rounded-xl border bg-white px-3 py-2.5 pl-9 text-sm outline-none transition
        placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900/10
        ${error ? "border-red-300 focus:ring-red-100" : "border-gray-200"}`}
        />
    </div>
));
TextInput.displayName = "TextInput";

export default function DateField({
    id,
    value,            // expects 'YYYY-MM-DD' or ''
    onChange,         // called with 'YYYY-MM-DD'
    minDate,          // Date object
    placeholder = "Select date",
    error = false,
}) {
    const selected = value ? new Date(value) : null;

    return (
        <DatePicker
            wrapperClassName="w-full"
            selected={selected}
            onChange={(d) => onChange(d ? formatYMD(d) : "")}
            minDate={minDate}
            dateFormat="yyyy-MM-dd"
            customInput={<TextInput id={id} placeholder={placeholder} error={error} />}
            // nice UX tweaks:
            isClearable
            showPopperArrow={false}
            calendarStartDay={1}
        />
    );
}
