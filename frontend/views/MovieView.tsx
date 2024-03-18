import { MoviesEndpoint, FiltersEndpoint, UsersEndpoint } from "Frontend/generated/endpoints.js";
import React, {useEffect, useState} from "react";
import Movie from "Frontend/generated/com/example/cgi_demo_app/model/Movie";
import User from "Frontend/generated/com/example/cgi_demo_app/model/User";
import {AppLayout} from "@hilla/react-components/AppLayout";
import {Tabs} from "@hilla/react-components/Tabs";
import {DrawerToggle} from "@hilla/react-components/DrawerToggle";
import css from "../themes/my-theme/styles.module.css"
import { selectUser } from "Frontend/modules/UserSelection";
import { unifiedSearchFilter } from "Frontend/modules/filters/UnifiedSearchFilter";
import { genreFilter } from "Frontend/modules/filters/GenreFilter";
import { languageFilter } from "Frontend/modules/filters/LanguageFilter";
import { ageFilter } from "Frontend/modules/filters/AgeFilter";
import { startTimeFilter } from "Frontend/modules/filters/StartTimeFilter";
import { recommendFilter } from "Frontend/modules/filters/RecommendFilter";
import { gridOfMovies } from "Frontend/modules/DisplayMovies";
import { ticketPurchaseDialog } from "Frontend/modules/dialogs/TicketPurchaseDialog";
import { seatingRecommendationDialog } from "Frontend/modules/dialogs/SeatingRecommendationDialog";
import Language from "Frontend/generated/com/example/cgi_demo_app/enums/Language";
import Genre from "Frontend/generated/com/example/cgi_demo_app/enums/Genre";


const h1Style = {
    fontSize: 'var(--lumo-font-size-l)',
    margin: 'var(--lumo-space-m)',
    marginLeft: "0px",
};


export default function MoviesView() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
    const [movieLanguages, setMovieLanguages] = useState<Language[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [filterAgeLimit, setFilterAgeLimit] = useState<string>("");
    const [expandedMovie, setExpandedMovie] = useState<Movie[]>([]);
    const [selectedSession, setSelectedSession] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedMovieName, setSelectedMovieName] = useState<string>("");
    const [selectedMovieLanguage, setSelectedMovieLanguage] = useState<string>("");
    const [timeFilter, setTimeFilter] = useState<string>("");
    const [ticketAmount, setTicketAmount] = useState<string>("");
    const [ticketDialogOpened, setTicketDialogOpened] = useState<boolean>(false);
    const [seatingDialogOpened, setSeatingDialogOpened] = useState<boolean>(false);
    const [activeUserId, setActiveUserId] = useState("");
    const [seating, setSeating] = useState<Array<Array<number>>>(Array<Array<number>>)

    useEffect(() => {
        getMoviesFromServer().then();
        getGenresFromServer().then();
        getLanguagesFromServer().then();
        getUsersFromServer().then();
    }, []);

    async function getGenresFromServer() {
        const serverResponse = await FiltersEndpoint.getGenres();
        const genres = serverResponse.filter((genre: Genre | undefined): genre is Genre =>
            genre != undefined
        );

        setMovieGenres(genres);
    }

    async function getLanguagesFromServer() {
        const serverResponse = await FiltersEndpoint.getLanguages();
        const languages: Language[] = serverResponse.filter((language: Language | undefined): language is Language =>
            language !== undefined
        );

        setMovieLanguages(languages);
    }

    async function getUsersFromServer() {
        const usersListFromServer = await UsersEndpoint.getUsers();
        const allUsers = usersListFromServer.map((user) => ({
            ...user,
            displayName: `${user?.firstName} ${user?.lastName}`,
        }));
        setUsers(allUsers);
    }

    async function getMoviesFromServer() {
        const serverResponse = await MoviesEndpoint.getMovies();
        const moviesList: Movie[] = serverResponse.filter((movie: Movie | undefined): movie is Movie =>
            movie !== undefined
        );

        setMovies(moviesList);
        setFilteredMovies(moviesList);
    }

    return (
        <>
            <AppLayout primarySection="drawer" style={css}>
                {/*Filter bar*/}
                <DrawerToggle slot="navbar"/>
                <Tabs slot="drawer" orientation="vertical" style={{width: "flex"}}>

                    {selectUser(users ?? [], movies ?? [], setFilteredMovies, setActiveUserId)}

                    <h1>Filters</h1>

                    {unifiedSearchFilter(movies ?? [], setFilteredMovies)}

                    {genreFilter(movies ?? [], movieGenres ?? [], setFilteredMovies,)}

                    {languageFilter(movies ?? [], movieLanguages ?? [], setFilteredMovies)}

                    {ageFilter(movies ?? [], filterAgeLimit ?? "", setFilteredMovies, setFilterAgeLimit)}

                    {startTimeFilter(timeFilter, setTimeFilter)}

                    {recommendFilter(movies ?? [], users ?? [], activeUserId, setFilteredMovies)}

                </Tabs>

                {/*Main Content*/}

                <h1 slot="navbar" style={h1Style}>
                    Movies
                </h1>

                {gridOfMovies(filteredMovies,
                    expandedMovie,
                    timeFilter,
                    ticketDialogOpened,
                    setExpandedMovie,
                    setSelectedDate,
                    setSelectedSession,
                    setSelectedMovieName,
                    setSelectedMovieLanguage,
                    setTicketDialogOpened
                )}

                {ticketPurchaseDialog(
                    ticketDialogOpened,
                    selectedMovieName,
                    selectedDate,
                    selectedSession,
                    selectedMovieLanguage,
                    ticketAmount,
                    setTicketDialogOpened,
                    setSeatingDialogOpened,
                    setTicketAmount
                )}

                {seatingRecommendationDialog(
                    seating ?? [],
                    selectedMovieName,
                    selectedDate,
                    selectedSession,
                    selectedMovieLanguage,
                    ticketAmount,
                    seatingDialogOpened,
                    setTicketDialogOpened,
                    setSeatingDialogOpened,
                    setSelectedMovieName,
                    setSelectedDate,
                    setSelectedSession,
                    setTicketAmount,
                    setSeating
                )}
            </AppLayout>
        </>
    );

}
