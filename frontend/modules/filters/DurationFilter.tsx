import React from "react";
import {TimePicker, TimePickerChangeEvent} from "@hilla/react-components/TimePicker";
import Movie from "Frontend/generated/com/example/cgi_demo_app/model/Movie";


export const durationFilter = (
    movies: Movie[],
    durationFilterValue: string,
    setDurationFilter: React.Dispatch<React.SetStateAction<string>>,
    setFilteredMovies: React.Dispatch<React.SetStateAction<Movie[]>>) => {

    const durationChanged = (e: TimePickerChangeEvent) => {
        let durationValue = e.target.value;

        if (durationValue.length === 0) {
            setFilteredMovies(movies);
            setDurationFilter("");
        } else {
            setFilteredMovies(
                movies.filter(movie => {
                    let movieDuration = "0" + movie.duration?.replace(":", ".");
                    let modifiedFilterValue = durationValue.replace(":", ".");
                    return parseFloat(movieDuration) <= parseFloat(modifiedFilterValue);
                })
            );
        }

        setDurationFilter(durationValue);
    };

    return (
        <TimePicker
            label="Duration filter"
            min="00:00"
            max="04:30"
            step={60 * 15}
            value={durationFilterValue}
            onChange={durationChanged}
            clearButtonVisible
            helper-text="Hours : Minutes"
        />
    );
};