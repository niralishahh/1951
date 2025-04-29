import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const WeekOrderForm = () => {
  const [date, setDate] = useState(new Date());
  const [weekType, setWeekType] = useState("");


  return (
    <div>
      {/* Date */}  
      <label>Select Date: </label>
      <DatePicker
        selected={date}
        onChange={(date) => setDate(date)}
        dateFormat="MM-dd-yyyy" // Customize format if needed
      />
      <p>Selected: {date.toDateString()}</p>
      
      {/* Week Type */}
      <label> Week Type:
        <input
          type="radio"
          name="options"
          value="School"
          checked={weekType === "School"}
          onChange={() => setWeekType("School")}
        />
        School
      </label>
      
      <label>
        <input
          type="radio"
          name="options"
          value="Break"
          checked={weekType === "Break"}
          onChange={() => setWeekType("Break")}
        />
        Break
      </label>

      {/* Week Type */}

    </div>
  );
};

export default WeekOrderForm;
