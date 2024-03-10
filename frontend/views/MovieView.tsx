import { MoviesEndpoint } from "Frontend/generated/endpoints.js";
import React, {useEffect, useState} from "react";
import {HorizontalLayout} from "@hilla/react-components/HorizontalLayout";
import {VerticalLayout} from "@hilla/react-components/VerticalLayout";
import type Movie from "Frontend/generated/com/example/cgi_demo_app/Movie";
import type User from "Frontend/generated/com/example/cgi_demo_app/User";
import {Grid} from "@hilla/react-components/Grid";
import {AppLayout} from "@hilla/react-components/AppLayout";
import {GridSortColumn} from "@hilla/react-components/GridSortColumn";
import {Tabs} from "@hilla/react-components/Tabs";
import {DrawerToggle} from "@hilla/react-components/DrawerToggle";
import css from "../themes/my-theme/styles.module.css"
import {TextField} from "@hilla/react-components/TextField";
import {Icon} from "@hilla/react-components/Icon";
import {Button} from "@hilla/react-components/Button";
import {ComboBox} from "@hilla/react-components/ComboBox";
import {TimePicker} from "@hilla/react-components/TimePicker";
import type { ComboBoxFilterChangedEvent } from '@hilla/react-components/ComboBox.js';
import {Select} from "@hilla/react-components/Select";
import {NumberField, NumberFieldEventMap, NumberFieldProps} from "@hilla/react-components/NumberField";



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
    const [movieLanguages, setMovieLanguages] = useState<string[]>();
    const [users, setUsers] = useState<User[]>();

    useEffect(() => {
        getMovies();
    }, []);

    async function getMovies() {
        const serverResponse = await MoviesEndpoint.getMovies();
        console.log(serverResponse);
        // @ts-ignore
        setMovies(serverResponse);
        // @ts-ignore
        setFilteredMovies(serverResponse);
        setMovieGenres(await MoviesEndpoint.getGenres());

        setMovieLanguages(await MoviesEndpoint.getLanguages());
        setMovieLanguages(await MoviesEndpoint.getLanguages());
        setUsers(await MoviesEndpoint.getUsers());
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

    const genreFilterChanged = (e: ComboBoxFilterChangedEvent) => {
        const filter = e.detail.value;
        setFilteredMovies(
            movies.filter(({ genre }) =>
                genre.toLowerCase().includes(filter.toLowerCase())
            )
        );
    };

    function getGenreFilter() {
        return <ComboBox
                    label="Genre"
                    item-label-path="name"
                    item-value-path="genre"
                    items={movieGenres}
                    onValueChanged={genreFilterChanged}
                    clearButtonVisible
                />;
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
            <GridSortColumn hidden>

            </GridSortColumn>
        </Grid>;
    }


    const languageFilterChanged = (e: ComboBoxFilterChangedEvent) => {
        const filter = e.detail.value;
        setFilteredMovies(
            movies.filter(({ language }) =>
                language.toLowerCase().includes(filter.toLowerCase())
            )
        );
    };
    function getLanguageFilter() {
        return <ComboBox
            label="Language"
            item-label-path="name"
            item-value-path="language"
            items={movieLanguages}
            clearButtonVisible
            onValueChanged={languageFilterChanged}
        />;
    }

    const ageFilterChanged = (e: NumberFieldProps) => {
        const filter = e.value;
        setFilteredMovies(
            movies.filter(({ ageLimit }) =>
                ageLimit > parseInt(filter)
            )
        );
    };

    function getAgeFilter() {
        return <NumberField
                    label="Age limit"
                    value="13"
                    min={1}
                    max={199}
                    helperText="Enter age between 1-199"
        >
                    <div slot="suffix">a</div>
                </NumberField>
    }

    function getStartTimeFilter() {
        return <TimePicker label="Sessions starting after" value="07:00" />;
    }


    function selectUser() {
        return <ComboBox
            label="Users"
            item-label-path="name"
            item-value-path="id"
            items={users} />;
    }

    return (
        <>
            <AppLayout primarySection="drawer" style={css}>
                {/*Filter bar*/}
                <DrawerToggle slot="navbar"/>
                <Tabs slot="drawer" orientation="vertical">

                    {selectUser()}

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
