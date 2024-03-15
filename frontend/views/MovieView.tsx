import { MoviesEndpoint, SeatingEndpoint } from "Frontend/generated/endpoints.js";
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
import {Dialog} from "@hilla/react-components/Dialog";
import {IntegerField} from "@hilla/react-components/IntegerField";
import {Notification} from "@hilla/react-components/Notification";
import { LitElement, render } from "lit";


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


const screenStyle = {
    width: "100%",
    marginRight: "auto",
    marginLeft: "auto",
    height: "128px"
};

const projectorStyle = {
    width: "auto",
    marginRight: "auto",
    marginLeft: "auto",
    height: "48px"
};


export default function MoviesView() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const [movieGenres, setMovieGenres] = useState<string[]>();
    const [movieLanguages, setMovieLanguages] = useState<string[]>();
    const [users, setUsers] = useState<User[]>();
    const [filterAgeLimit, setFilterAgeLimit] = useState<string>("");
    const [expandedMovie, setExpandedMovie] = useState<Movie[]>([]);
    const [selectedSession, setSelectedSession] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedMovieName, setSelectedMovieName] = useState<string>("");
    const [selectedMovieLanguage, setSelectedMovieLanguage] = useState<string>("");
    const [timeFilter, setTimeFilter] = useState<string>("");
    const [ticketAmount, setTicketAmount] = useState<string>("");
    const [ticketDialogOpened, setTicketDialogOpened] = useState(false);
    const [seatingDialogOpened, setSeatingDialogOpened] = useState(false);
    const [activeUserId, setActiveUserId] = useState("");
    const [seating, setSeating] = useState<Array<Array<number>>>()
    const [row, setRow] = useState<number>(1)
    const [column, setColumn] = useState<number>(1)



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

    const SessionDetail = ({ date, session, movieName, movieLanguage} : {date:string, session:string, movieName:string, movieLanguage:string}) => {
        const openDialogueForTickets = () => {

            setSelectedDate(date);
            setSelectedSession(session);
            setSelectedMovieName(movieName)
            setSelectedMovieLanguage(movieLanguage);
            setTicketDialogOpened(true);
        };

        return (
            <div style={{width: "100%"}}>
                <Button id={movieName+date+session} theme="secondary contrast" style={sessionButtonDisplayStyle} onClick={openDialogueForTickets}>{session}</Button>
            </div>

        );
    };

    const filterSessionUsingTimeFilter = (session: string) => {
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
                        {movie.sessions?.filter(session => filterSessionUsingTimeFilter(session ?? "")).map(session =>
                            <SessionDetail session={session || ""} date={date || ""} movieName={ movie.name|| ""} movieLanguage={movie.language || ""}/>
                        )}
                    </HorizontalLayout>
                ))}
            </VerticalLayout>
        </Details>
    }

    //This function has been copied from https://www.geeksforgeeks.org/javascript-program-to-find-the-most-frequent-element-in-an-array/
    function getMostOccuredElement(arrayToCheck: any[]) {
        let count = 1,
            max = 0,
            el;
        for (let i = 1; i < arrayToCheck.length; ++i) {
            if (arrayToCheck[i] === arrayToCheck[i - 1]) {
                count++;
            } else {
                count = 1;
            }
            if (count > max) {
                max = count;
                el = arrayToCheck[i];
            }
        }
        return el;
    }

    function getRecommendedForUser(){
        var activeUser = users?.filter((user) => activeUserId === user.id) ? users?.filter((user) => activeUserId === user.id): [];
        var activeUserMovies = activeUser[0].movies ? activeUser[0].movies : [];
        var activeUserGenres: string[] = [];
        var activeUserLanguages: string[] = [];
        var activeUserMovieAgeLimits: number[] = [];
        var totalAgeLimitAge = 0;
        var activeUserAvgAgeLimit = 0;

        if(activeUserMovies.length > 0){
           activeUserMovies.forEach((movie) => {
               activeUserGenres.push(movie?.genre ?? "");
               activeUserLanguages.push(movie?.language ?? "");
               activeUserMovieAgeLimits.push(movie?.ageLimit ?? 0);
           });

           //Code taken from https://www.geeksforgeeks.org/javascript-program-to-find-the-most-frequent-element-in-an-array/
           activeUserGenres.sort((a, b) => a.localeCompare(b));
           activeUserLanguages.sort((a, b) => a.localeCompare(b));
           activeUserMovieAgeLimits.sort((a, b) => a-b);

            var activeUserFavouriteGenre = getMostOccuredElement(activeUserGenres);
            var activeUserFavouriteLanguage = getMostOccuredElement(activeUserLanguages);
            activeUserMovieAgeLimits.forEach((age) => totalAgeLimitAge += age);
            activeUserAvgAgeLimit = Math.floor(totalAgeLimitAge/activeUserMovieAgeLimits.length);
            var filteredMoviesAccordingToAge = movies.filter((movie) => movie.ageLimit <= activeUserAvgAgeLimit);
            var filteredMoviesAccordingToLanguage = filteredMoviesAccordingToAge.filter((movie) => movie.language == activeUserFavouriteLanguage);
            var filteredMoviesAccordingToGenre = filteredMoviesAccordingToLanguage.filter(
                (movie) =>
                    movie.genre == activeUserFavouriteGenre).concat(
                        filteredMoviesAccordingToLanguage.filter(
                            (movie) =>
                                movie.genre != activeUserFavouriteGenre));
            if(filteredMoviesAccordingToGenre.length == 0){
                Notification.show('No suitable movie could be found based on watch history.', {
                    theme: 'warning',
                });
            } else {
                console.log(activeUserFavouriteLanguage + activeUserFavouriteGenre + activeUserAvgAgeLimit);
                setFilteredMovies(filteredMoviesAccordingToGenre);
            }

        } else {
            Notification.show('No watch history', {
                theme: 'warning',
            });
        }
    }

    function getRecommendedButton() {
        return <Button theme="primary" style={{backgroundColor: "darkGray", marginTop: "15px"}} onClick={() => {
            getRecommendedForUser();

        }}>
            Recommend movies</Button>;
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
                    clearButtonVisible
                >
                    <div slot="suffix">a</div>
                </NumberField>
    }

    const timeFilterChanged  = (e: TimePickerChangeEvent) => {
        const timeValue = e.target.value;
        setTimeFilter(timeValue);
    };

    function getStartTimeFilter() {
        return <TimePicker label="Sessions starting after"
                           value={timeFilter}
                           onChange={timeFilterChanged}
                           clearButtonVisible
        />;
    }

    const activeUserChanged = (e: ComboBoxFilterChangedEvent) => {
        var userId= e.detail.value;
        if(userId.length == 0){
            setFilteredMovies(movies);
        }
        setActiveUserId(userId);
    };

    function selectUser() {
        return <ComboBox
                    label="Users"
                    itemLabelPath="displayName"
                    item-value-path="id"
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

    async function getSeatingFromServer(){
        const serverResponse = await SeatingEndpoint.getSeating(selectedMovieName + "," + selectedDate + "," + selectedSession + "," + selectedMovieLanguage);
        // @ts-ignore
        setSeating(serverResponse);

    }

    const handleTicketPurchase = () => {
        //Do some seating magic//
        getSeatingFromServer();
        setSeatingDialogOpened(true);
        setTicketDialogOpened(false);
    };


    const handleTicketAmountChanged  = (e: NumberFieldChangeEvent) => {
        const purchasableTicketAmount = e.target.value;
        setTicketAmount(purchasableTicketAmount);
    };

    function getTicketPurchaseDialog (){
        return (<>
            <Dialog
                headerTitle="Purchase window"
                opened={ticketDialogOpened}
                onOpenedChanged={({ detail }) => {
                    setTicketDialogOpened(detail.value);
                }}
                footerRenderer={() => (
                    <>
                        <Button onClick={() => setTicketDialogOpened(false)}>Cancel</Button>
                        <Button theme="primary" onClick={handleTicketPurchase}>
                            Purchase
                        </Button>
                    </>
                )}
            >
                <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
                    <div>Movie name: {selectedMovieName}</div>
                    <div>Movie language: {selectedMovieLanguage}</div>
                    <div>Date: {selectedDate}</div>
                    <div>Session: {selectedSession}</div>
                    <IntegerField
                        label="Tickets"
                        helperText="Max 10 tickets"
                        min={1}
                        max={10}
                        value={ticketAmount}
                        stepButtonsVisible
                        onChange={handleTicketAmountChanged}
                    />
                </VerticalLayout>
            </Dialog>
        </>)
    }

    const handleSeatingConfirm = () => {
        //Do some seating magic
        // and send that to backend
        console.log("Closing seating window");
        setSeatingDialogOpened(false);
        setTicketDialogOpened(false);
        setSelectedMovieName("");
        setSelectedDate("");
        setSelectedSession("");
        setTicketAmount("1");
    };

    const SeatDetail = ({ seat } : {seat: number}) => {
        const seatStyle = {
            width: "48px",
            height: "48px"
        };

        if(seat === 0){
            return <img src="/pictures/cinema_icons/seat_empty.png" data-row="${row}" data-column="$column" style={seatStyle} />;
        } else if (seat == 1){
            return <img src="/pictures/cinema_icons/seat_taken.png" style={seatStyle}/>
        } else {
            return <img src="/pictures/cinema_icons/seat_recommended.png" data-row="${row}" data-column="$column" style={seatStyle} />;
        }
    };

    function insertRecommendationSeatsIntoSeating(){
        if(!seatingDialogOpened){
            return;
        }
        var middlePoint = [seating?.length, seating?.[0]?.length];
        const rowMidpoint = middlePoint?.[0] ?? 0;
        const columnMidpoint = middlePoint?.[1] ?? 0;
        var pointsToCheck = [];
        var beenPoints = [];
        var currentPoint = [Math.floor(rowMidpoint/2), Math.floor((columnMidpoint-1)/2)];

        pointsToCheck.push(currentPoint);
        beenPoints.push(currentPoint)
        var counter = 0

        while(pointsToCheck.length != 0){
            if (pointsToCheck.length === 0) {
                break; // Break the loop if pointsToCheck is empty
            }
            counter++;
            console.log(counter);
            console.log(pointsToCheck);

            currentPoint = pointsToCheck.shift() ?? [];
            // Check neighboring points
            for (let i = -1; i < 2; i++) {
                if (
                    currentPoint[0] + i >= 0 &&
                    currentPoint[0] + i < rowMidpoint &&
                    !pointsToCheck.some(point => point[0] === currentPoint[0] + i && point[1] === currentPoint[1]) &&
                    !beenPoints.some(point => point[0] === currentPoint[0] + i && point[1] === currentPoint[1])
                ) {
                    pointsToCheck.push([currentPoint[0] + i, currentPoint[1]]);
                }
            }

            for (let i = -1; i < 2; i++) {
                if (
                    currentPoint[1] + i >= 0 &&
                    currentPoint[1] + i < columnMidpoint &&
                    !pointsToCheck.some(point => point[0] === currentPoint[0] && point[1] === currentPoint[1] + i) &&
                    !beenPoints.some(point => point[0] === currentPoint[0] && point[1] === currentPoint[1] + i)
                ) {
                    pointsToCheck.push([currentPoint[0], currentPoint[1] + i]);
                }
            }

            var suitableSpots = true;
            for (let i = 0; i < parseInt(ticketAmount); i++) {
                if (seating?.[currentPoint[0]]?.[currentPoint[1] + i] !== undefined) {
                    if (seating[currentPoint[0]][currentPoint[1] + i] !== 0) {
                        suitableSpots = false; // Set to false if a spot is taken
                        break; // Break out of the loop
                    }
                } else {
                    suitableSpots = false; // Set to false if a spot is out of bounds
                    break; // Break out of the loop
                }
            }
            console.log(suitableSpots)
            if(suitableSpots){
                for (let i = 0; i < parseInt(ticketAmount); i++) {
                    if (seating?.[currentPoint[0]]?.[currentPoint[1] + i] !== undefined) {
                        seating[currentPoint[0]][currentPoint[1] + i] = 2;
                    }
                }
                break;
            }
            beenPoints.push(currentPoint);
            console.log("---------------------------------------------");
        }

        pointsToCheck = [];
        beenPoints = [];
    }

    function getSeatingRecommendationDialog() {
        insertRecommendationSeatsIntoSeating();
        return (<>
            <Dialog
                headerTitle="Seating window"
                opened={seatingDialogOpened}
                onOpenedChanged={({ detail }) => {
                    setSeatingDialogOpened(detail.value);
                }}
                footerRenderer={() => (
                    <>
                        <Button onClick={() => setSeatingDialogOpened(false)}>Cancel</Button>
                        <Button theme="primary" onClick={handleSeatingConfirm}>
                            Confirm
                        </Button>
                    </>
                )}
                style={{width: "500px", height: "fit-content", blockSize: "fit-content"}}
            >
                <VerticalLayout style={{width: "auto", height: "auto"}}>
                    {/*ToDo: implement some serious seating algoritm */}
                    <img src="/pictures/cinema_icons/projector.png" style={projectorStyle}/>
                    {seating?.map((row) => (
                        <HorizontalLayout>
                            {row.map((seat) => (
                                <SeatDetail seat={seat}/>
                            ))}
                        </HorizontalLayout>
                    ))}
                    <img src="/pictures/cinema_icons/screen.png" style={screenStyle}/>

                </VerticalLayout>
            </Dialog>
        </>);
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

                {getTicketPurchaseDialog()}

                {getSeatingRecommendationDialog()}


            </AppLayout>
        </>
    );

}
