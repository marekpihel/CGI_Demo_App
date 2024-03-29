import React from "react";
import {TimePicker, TimePickerChangeEvent} from "@hilla/react-components/TimePicker";


export const startTimeFilter = (
    timeFilter: string,
    setTimeFilter: React.Dispatch<React.SetStateAction<string>>) => {

    const timeFilterChanged = (e: TimePickerChangeEvent) => {
        const timeValue = e.target.value;
        if (timeValue.length == 0) {
            setTimeFilter("");
        } else {
            setTimeFilter(timeValue);
        }
    };

    return (
        <TimePicker
            label="Sessions starting after"
            value={timeFilter}
            onChange={timeFilterChanged}
            clearButtonVisible
        />
    );
};