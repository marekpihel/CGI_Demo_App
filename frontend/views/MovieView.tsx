import { Button } from "@hilla/react-components/Button.js";
import { Notification } from "@hilla/react-components/Notification.js";
import { TextField } from "@hilla/react-components/TextField.js";
import { MoviesEndpoint } from "Frontend/generated/endpoints.js";
import React, {useEffect, useState} from "react";
import {VirtualList} from "@hilla/react-components/VirtualList";
import {HorizontalLayout} from "@hilla/react-components/HorizontalLayout";
import {Avatar} from "@hilla/react-components/Avatar";
import {VerticalLayout} from "@hilla/react-components/VerticalLayout";
import {Details} from "@hilla/react-components/Details";
import type Movie from "Frontend/generated/com/example/cgi_demo_app/Movie";
import {Grid} from "@hilla/react-components/Grid";
import {GridColumn} from "@hilla/react-components/GridColumn";
import { MenuBar, type MenuBarItem } from "@hilla/react-components/MenuBar";


export default function MoviesView() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [expandedMovie, setExpandedMovie] = useState<Movie[]>([]);
    const [selectedDate, setSelectedDate] = useState<MenuBarItem | undefined>();

    useEffect(() => {
        getMovies();
    }, []);

    async function getMovies() {
        const moviesList = await MoviesEndpoint.getMovies();
        console.log(moviesList);
        // @ts-ignore
        setMovies(moviesList);
    }


    function dateRenderer ({dates}: { dates: any[] }){
        return (
            <>
                {dates.map(date => (
                        <Button>
                            {date}
                        </Button>
                ))}
            </>
        );
    }

    function getMovieDates({dates}: { dates: any }){
        var menuDate = [];
        var date = "";

        for (date in dates) {
            console.log(date)
            menuDate.push({text: date})
        }
        console.log(menuDate);
        return menuDate;
    }


    //Possibly use Avatar for movie picture;
    const movieRenderer = ({ item: movie }: { item: Movie }) => (
        <HorizontalLayout theme="spacing margin">
            <Avatar
                name={movie.name}
            />

            <VerticalLayout>
                <b>
                    {movie.name}
                </b>
                <span>Genre: {movie.genre}</span>
                <span>Language: {movie.language}</span>

                <Details
                    summary="Dates"
                    opened={expandedMovie.includes(movie)}
                    onClick={({currentTarget: details}) => {
                        if (details.opened) {
                            setExpandedMovie([...expandedMovie, movie]);
                        } else {
                            setExpandedMovie(expandedMovie.filter((p) => p !== movie));
                        }
                    }}
                >
                    <HorizontalLayout>
                        {dateRenderer({dates: movie.dates})}
                    </HorizontalLayout>
                </Details>
            </VerticalLayout>
        </HorizontalLayout>
    );



    return (
        <>
            <VirtualList style={{height:"100%"}} items={movies}>{movieRenderer}</VirtualList>
        </>
    );

}
