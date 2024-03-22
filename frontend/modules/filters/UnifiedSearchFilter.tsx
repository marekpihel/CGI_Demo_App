import Movie from "Frontend/generated/com/example/cgi_demo_app/model/Movie";
import React from "react";
import {TextField} from "@hilla/react-components/TextField";
import {Icon} from "@hilla/react-components/Icon";


export const unifiedSearchFilter = (
    movies: Movie[],
    setFilteredMovies: React.Dispatch<React.SetStateAction<Movie[]>>) => {


    return (
        <TextField
            placeholder="Search movies"
            style={{width: "auto"}}
            onValueChanged={(e) => {
                const searchTerm = (e.detail.value || '').trim().toLowerCase();
                setFilteredMovies(
                    movies.filter(
                        ({genre, name, language, ageLimit, duration}) =>
                            !searchTerm ||
                            genre?.toLowerCase().includes(searchTerm) ||
                            name?.toLowerCase().includes(searchTerm) ||
                            language?.toLowerCase().includes(searchTerm) ||
                            ageLimit <= parseInt(searchTerm)
                    )
                );
            }}
        >
            <Icon slot="prefix" style={{content: `url("/icons/png/search.png")`, height: "16px", width: "16px"}}></Icon>
        </TextField>
    );
};