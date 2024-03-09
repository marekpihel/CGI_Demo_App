import { Button } from "@hilla/react-components/Button.js";
import { Notification } from "@hilla/react-components/Notification.js";
import { TextField } from "@hilla/react-components/TextField.js";
import { HelloEndpoint, MoviesEndpoint } from "Frontend/generated/endpoints.js";
import React, {useEffect, useState} from "react";
import {VirtualList} from "@hilla/react-components/VirtualList";
import {HorizontalLayout} from "@hilla/react-components/HorizontalLayout";
import {Avatar} from "@hilla/react-components/Avatar";
import {VerticalLayout} from "@hilla/react-components/VerticalLayout";
import {Details} from "@hilla/react-components/Details";
import type Movie from "Frontend/generated/com/example/cgi_demo_app/Movie";

export default function MoviesView() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [expandedMovie, setExpandedMovie] = useState<Movie[]>([]);


    useEffect(() => {
        MoviesEndpoint.getMovies().then((moviesList) => {
            const validMovies = moviesList?.filter((movie): movie is Movie => !!movie) || [];
            setMovies(movies);
        });
    }, []);

    //Possibly use Avatar for movie picture;
    const movieRenderer = ({ item: movie }: { item: Movie }) => (
        <HorizontalLayout theme="spacing margin">
            {/*<Avatar
                img={person.pictureUrl}
                name={`${person.firstName} ${person.lastName}`}
                style={avatarStyle}
            />*/}

            <VerticalLayout>
                <b>
                    {movie.name}
                </b>
                <span>Genre: {movie.genre}</span>
                <span>Language: {movie.language}</span>

                <Details
                    summary="Contact information"
                    opened={expandedMovie.includes(movie)}
                    onClick={({currentTarget: details}) => {
                        if (details.opened) {
                            setExpandedMovie([...expandedMovie, movie]);
                        } else {
                            setExpandedMovie(expandedMovie.filter((p) => p !== movie));
                        }
                    }}
                >
                    {/*<VerticalLayout>
                        <span>{movie.dates}</span>
                    </VerticalLayout>*/}
                </Details>
            </VerticalLayout>
        </HorizontalLayout>
    );


    return (
        <VirtualList items={movies}>{movieRenderer}</VirtualList>
    );
}
