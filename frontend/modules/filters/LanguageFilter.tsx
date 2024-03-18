import Movie from "Frontend/generated/com/example/cgi_demo_app/model/Movie";
import React from "react";
import {ComboBox, type ComboBoxFilterChangedEvent} from "@hilla/react-components/ComboBox";


export const languageFilter = (
    movies: Movie[],
    movieLanguages: string[],
    setFilteredMovies: React.Dispatch<React.SetStateAction<Movie[]>>) => {

    const languageFilterChanged = (e: ComboBoxFilterChangedEvent) => {
        const filter = e.detail.value;
        setFilteredMovies(
            movies.filter(({ language }) =>
                language?.toLowerCase().includes(filter.toLowerCase())
            )
        );
    };

    return (
        <ComboBox
            label="Language"
            item-label-path="name"
            item-value-path="language"
            items={movieLanguages}
            clearButtonVisible
            onValueChanged={languageFilterChanged}
        />
    );
};