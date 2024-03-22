import Movie from "Frontend/generated/com/example/cgi_demo_app/model/Movie";
import React from "react";
import {NumberField, NumberFieldChangeEvent} from "@hilla/react-components/NumberField";


export const ageFilter = (
    movies: Movie[],
    filterAgeLimit: string,
    setFilteredMovies: React.Dispatch<React.SetStateAction<Movie[]>>,
    setFilterAgeLimit: React.Dispatch<React.SetStateAction<string>>) => {

    const ageFilterChanged = (e: NumberFieldChangeEvent) => {
        const ageValue = e.target.value;
        if (ageValue.length === 0) {
            setFilteredMovies(movies);
            setFilterAgeLimit("");
        } else {
            setFilterAgeLimit(ageValue);
            setFilteredMovies(
                movies.filter(({ageLimit}) =>
                    ageLimit <= parseInt(ageValue)
                )
            );
        }
    };

    return (
        <NumberField
            id={"ageValue"}
            label="Age limit"
            value={filterAgeLimit}
            min={1}
            max={199}
            helperText="Enter age between 1-199"
            onChange={ageFilterChanged}
            clearButtonVisible
        >
            <div slot="suffix">y</div>
        </NumberField>
    );
};