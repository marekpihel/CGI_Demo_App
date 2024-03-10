import { MoviesEndpoint } from "Frontend/generated/endpoints.js";
import React, {useEffect, useState} from "react";
import {HorizontalLayout} from "@hilla/react-components/HorizontalLayout";
import {VerticalLayout} from "@hilla/react-components/VerticalLayout";
import type Movie from "Frontend/generated/com/example/cgi_demo_app/Movie";
import {Grid} from "@hilla/react-components/Grid";
import {AppLayout} from "@hilla/react-components/AppLayout";
import {GridSortColumn} from "@hilla/react-components/GridSortColumn";
import {Tabs} from "@hilla/react-components/Tabs";
import {Tab} from "@hilla/react-components/Tab";
import {DrawerToggle} from "@hilla/react-components/DrawerToggle";
import css from "../themes/my-theme/styles.module.css"
import {TextField} from "@hilla/react-components/TextField";
import {Icon} from "@hilla/react-components/Icon";
import {Button} from "@hilla/react-components/Button";
import {ComboBox} from "@hilla/react-components/ComboBox";
import {TimePicker} from "@hilla/react-components/TimePicker";



const h1Style = {
    fontSize: 'var(--lumo-font-size-l)',
    margin: 'var(--lumo-space-m)',
};

const movieLogoStyle = {
    height: "64px",
    width: "128px",
    borderRadius: ".5rem",

};



export default function MoviesView() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const [movieGenres, setMovieGenres] = useState<string[]>();

    useEffect(() => {
        getMovies();
    }, []);

    async function getMovies() {
        const moviesList = await MoviesEndpoint.getMovies();
        console.log(moviesList);
        // @ts-ignore
        setMovies(moviesList);
        // @ts-ignore
        setFilteredMovies(moviesList)

    }


    function clickedElement() {
        console.log("Element Clicked");
        return undefined;
    }

    //Possibly use Avatar for movie picture;
    const movieRenderer = ({ item: movie }: { item: Movie }) => (
        <HorizontalLayout theme="spacing margin">
                <img src={movie.imgLocation} style={movieLogoStyle}/>

                <VerticalLayout>
                    <b style={{width: "100%", paddingLeft: "10px", paddingRight: "10px"}}>
                        {movie.name}
                    </b>
                    <HorizontalLayout>
                        <span style={{padding: "10px"}}>Genre: {movie.genre}</span>
                        <span style={{padding: "10px"}}>Language: {movie.language}</span>
                    </HorizontalLayout>
                </VerticalLayout>
        </HorizontalLayout>
    );


    function getRecommendedButton() {
        return <Button onClick={() => {
            const searchTerm = ("Action").trim().toLowerCase();
            setFilteredMovies(
                movies.filter(
                    ({genre}) =>
                        !searchTerm ||
                        genre.toLowerCase().includes(searchTerm)
                )
            );
        }}>Recommend</Button>;
    }

    function getGenreFilter() {
        return <ComboBox label="Genre" item-label-path="name" item-value-path="id" items={movieGenres}/>;
    }

    function getUnifiedSearchAndFilter() {
        return <TextField
            placeholder="Search"
            style={{width: "auto"}}
            onValueChanged={(e) => {
                const searchTerm = (e.detail.value || '').trim().toLowerCase();
                setFilteredMovies(
                    movies.filter(
                        ({genre, name, language}) =>
                            !searchTerm ||
                            genre.toLowerCase().includes(searchTerm) ||
                            name.toLowerCase().includes(searchTerm) ||
                            language.toLowerCase().includes(searchTerm)
                    )
                );
            }}
        >
            <Icon slot="prefix" icon="vaadin:search"></Icon>
        </TextField>;
    }

    function getGridOfMovies() {
        return <Grid items={filteredMovies} style={{height: "100%"}}>
            <GridSortColumn>
                {movieRenderer}
            </GridSortColumn>
        </Grid>;
    }

    function getLanguageFilter() {
        return <ComboBox label="Language" item-label-path="name" item-value-path="id" items={movies}/>;
    }


    function getAgeFilter() {
        return <ComboBox label="AgeFilter" item-label-path="name" item-value-path="id" items={movieGenres}/>;
    }

    function getStartTimeFilter() {
        return <TimePicker label="Sessions starting after" value="07:00" />;
    }

    return (
        <>
            <AppLayout primarySection="drawer" style={css}>
                {/*Filter bar*/}
                <DrawerToggle slot="navbar"/>
                <Tabs slot="drawer" orientation="vertical">

                    <h1>Filters</h1>

                    {getUnifiedSearchAndFilter()}

                    {getGenreFilter()}

                    {getLanguageFilter()}

                    {getAgeFilter()}

                    {getStartTimeFilter()}

                    {getRecommendedButton()}
                </Tabs>

                {/*Main Content*/}

                <h1 slot="navbar" style={h1Style}>
                    Movies
                </h1>

                {getGridOfMovies()}

            </AppLayout>
        </>
    );

}
