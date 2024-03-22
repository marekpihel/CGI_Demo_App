import Movie from "Frontend/generated/com/example/cgi_demo_app/model/Movie";
import React from "react";
import {ComboBox, type ComboBoxFilterChangedEvent} from "@hilla/react-components/ComboBox";


export const genreFilter = (
    movies: Movie[],
    movieGenres: string[],
    setFilteredMovies: React.Dispatch<React.SetStateAction<Movie[]>>) => {

    const genreFilterChanged = (e: ComboBoxFilterChangedEvent) => {
        const filter = e.detail.value;
        if (filter.length == 0) {
            setFilteredMovies(movies);
        } else {
            setFilteredMovies(
                movies.filter(({genre}) =>
                    genre?.toLowerCase().includes(filter.toLowerCase())
                )
            );
        }
    };

    return (
        <ComboBox
            label="Genre"
            item-label-path="name"
            item-value-path="genre"
            items={movieGenres}
            onValueChanged={genreFilterChanged}
            clearButtonVisible
        />
    );
};