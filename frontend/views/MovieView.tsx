import { MoviesEndpoint } from "Frontend/generated/endpoints.js";
import React, {useEffect, useState} from "react";
import {HorizontalLayout} from "@hilla/react-components/HorizontalLayout";
import {VerticalLayout} from "@hilla/react-components/VerticalLayout";
import  Movie from "Frontend/generated/com/example/cgi_demo_app/Movie";
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
import {TimePicker, TimePickerChangeEvent} from "@hilla/react-components/TimePicker";
import type { ComboBoxFilterChangedEvent } from '@hilla/react-components/ComboBox.js';
import {NumberField, NumberFieldChangeEvent} from "@hilla/react-components/NumberField";
import {Details} from "@hilla/react-components/Details";




const h1Style = {
    fontSize: 'var(--lumo-font-size-l)',
    margin: 'var(--lumo-space-m)',
    marginLeft: "0px",
};

const movieLogoStyle = {
    height: "64px",
    width: "128px",
    borderRadius: ".5rem",

};

const movieDateRowStyle = {
    margin: "5px",
    outlineWidth: "2px",
    outlineStyle: "solid",
    borderRadius: "5em",
    outlineColor: "darkGray"
};

const movieDateDiplayStyle = {
    marginRight: "20px",
    color: "black",
    backgroundColor: "transparent"
};

const sessionButtonDisplayStyle = {
    marginRight: "20px",
    outlineColor: "gray",
    outlineStyle: "solid",
    outlineWidth: "2px",
    borerRadius: "2em",
    backgroundColor: "lightGray"
};



export default function MoviesView() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const [movieGenres, setMovieGenres] = useState<string[]>();
    const [movieLanguages, setMovieLanguages] = useState<string[]>();
    const [users, setUsers] = useState<User[]>();
    const [filterAgeLimit, setFilterAgeLimit] = useState<string>("");
    const [expandedMovie, setExpandedMovie] = useState<Movie[]>([]);
    const [selectedDates, setSelectedDates] = useState<string[]>([])
    const [selectedSession, setSelectedSession] = useState<string>("")
    const [selectedDate, setSelectedDate] = useState<string>("")
    const [selectedMovieName, setSelectedMovieName] = useState<string>("")
    const [timeFilter, setTimeFilter] = useState<string>("")
    const [filteredSessions, setFilteredSessions] = useState<string[]>([]);

    var activeUser: User;


    useEffect(() => {
        getMoviesFromServer();
        getGenresFromServer();
        getLanguagesFromServer();
        getUsersFromServer();
    }, []);

    async function getGenresFromServer() {
        // @ts-ignore
        setMovieGenres(await MoviesEndpoint.getGenres());
    }

    async function getLanguagesFromServer() {
        // @ts-ignore
        setMovieLanguages(await MoviesEndpoint.getLanguages());
    }

    async function getUsersFromServer() {
        const usersListFromServer = await MoviesEndpoint.getUsers()
        const allUsers = usersListFromServer.map((user) => ({
            ...user,
            displayName: `${user?.firstName} ${user?.lastName}`,
        }));
        setUsers(allUsers);
    }

    async function getMoviesFromServer() {
        const serverResponse = await MoviesEndpoint.getMovies();
        // @ts-ignore
        setMovies(serverResponse);

        // @ts-ignore
        setFilteredMovies(serverResponse);
    }

    function getGridOfMovies() {

        return <Grid items={filteredMovies} style={{height: "100%"}}>
            <GridSortColumn>
                {movieRenderer}
            </GridSortColumn>
        </Grid>;
    }

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
                    <HorizontalLayout>
                        {getDatesForMovie(movie)}
                    </HorizontalLayout>
                </VerticalLayout>
        </HorizontalLayout>
    );

    const SessionDetail = ({ date, session, movieName} : {date:string, session:string, movieName:string}) => {
        const openDialogueForTickets = () => {
            setSelectedDate(date);
            setSelectedSession(session);
            setSelectedMovieName(movieName)
        };

        return (
            <div style={{width: "100%"}}>
                <Button id={movieName+date+session} theme="secondary contrast" style={sessionButtonDisplayStyle} onClick={openDialogueForTickets}>{session}</Button>
            </div>

        );
    };

    const filterSessionUsingTimeFilter = (session) => {
        return session > timeFilter;
    };

    function getDatesForMovie(movie: Movie){
        return <Details
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
            <VerticalLayout style={{marginRight: "20px"}}>
                {movie.dates?.map(date => (
                    <HorizontalLayout style={movieDateRowStyle}>
                        <Button disabled theme="primary contrast" style={movieDateDiplayStyle}>{date}</Button>
                        {movie.sessions?.filter(filterSessionUsingTimeFilter).map(session =>
                            <SessionDetail session={session} date={date} movieName={movie.name}/>
                        )}
                    </HorizontalLayout>
                ))}
                <div>Selected movie: {selectedMovieName} date: {selectedDate} session {selectedSession}</div>
            </VerticalLayout>
        </Details>
    }

    function getRecommendedForUser(){
        console.log(activeUser?.firstName ?? "" + activeUser?.lastName ?? "" + activeUser?.movies ?? [])
    }

    function getRecommendedButton() {


        return <Button onClick={() => {
            getRecommendedForUser();
            const searchTerm = ("Action").trim().toLowerCase();
            setFilteredMovies(
                movies.filter(
                    ({genre}) =>
                        !searchTerm ||
                        genre?.toLowerCase().includes(searchTerm)
                )
            );
        }}>
            Recommend</Button>;
    }

    const genreFilterChanged = (e: ComboBoxFilterChangedEvent) => {
        const filter = e.detail.value;
        setFilteredMovies(
            movies.filter(({ genre }) =>
                genre?.toLowerCase().includes(filter.toLowerCase())
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
            placeholder="Search movies"
            style={{width: "auto"}}
            onValueChanged={(e) => {
                const searchTerm = (e.detail.value || '').trim().toLowerCase();
                setFilteredMovies(
                    movies.filter(
                        ({genre, name, language, ageLimit}) =>
                            !searchTerm ||
                            genre?.toLowerCase().includes(searchTerm) ||
                            name?.toLowerCase().includes(searchTerm) ||
                            language?.toLowerCase().includes(searchTerm) ||
                            ageLimit <= parseInt(searchTerm)
                    )
                );
            }}
        >
            <Icon slot="prefix" icon="vaadin:search"></Icon>
        </TextField>;
    }

    const languageFilterChanged = (e: ComboBoxFilterChangedEvent) => {
        const filter = e.detail.value;
        setFilteredMovies(
            movies.filter(({ language }) =>
                language?.toLowerCase().includes(filter.toLowerCase())
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

    const ageFilterChanged  = (e: NumberFieldChangeEvent) => {
        const ageValue = e.target.value;
        if(ageValue.length === 0){
            setFilteredMovies(movies);
        } else {
            setFilterAgeLimit(ageValue);
            setFilteredMovies(
                movies.filter(({ ageLimit }) =>
                    ageLimit <= parseInt(ageValue)
                )
            );
        }
    };

    function getAgeFilter() {
        return <NumberField
                    id={"ageValue"}
                    label="Age limit"
                    value={filterAgeLimit}
                    min={1}
                    max={199}
                    helperText="Enter age between 1-199"
                    onChange={ageFilterChanged}
                >
                    <div slot="suffix">a</div>
                </NumberField>
    }

    const timeFilterChanged  = (e: TimePickerChangeEvent) => {
        const timeValue = e.target.value;
        setTimeFilter(timeValue);
    };

    function getStartTimeFilter() {
        return <TimePicker label="Sessions starting after" value={timeFilter} onChange={timeFilterChanged}/>;
    }

    const activeUserChanged = (e: ComboBoxFilterChangedEvent) => {
        var userCombobox= document.getElementById("activeUserCombobox");
    };

    function selectUser() {
        return <ComboBox
                    id={"activeUserCombobox"}
                    label="Users"
                    itemLabelPath="displayName"
                    style={{textOverflow: "initial"}}
                    filteredItems={users}
                    onValueChanged={activeUserChanged}
                    clearButtonVisible
                    renderer={({ item: user }) => (
                        <div style={{ display: 'flex' }}>
                            <div>
                                {user.firstName} {user.lastName}
                                <div hidden id={"activeUserId"}>
                                    {user.id}
                                </div>
                            </div>
                        </div>
                    )}
                />;
    }

    return (
        <>
            <AppLayout primarySection="drawer" style={css}>
                {/*Filter bar*/}
                <DrawerToggle slot="navbar"/>
                <Tabs slot="drawer" orientation="vertical" style={{width: "flex"}}>

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
