import Movie from "Frontend/generated/com/example/cgi_demo_app/model/Movie";
import React from "react";
import {GridSortColumn} from "@hilla/react-components/GridSortColumn";
import {Grid} from "@hilla/react-components/Grid";
import {HorizontalLayout} from "@hilla/react-components/HorizontalLayout";
import {VerticalLayout} from "@hilla/react-components/VerticalLayout";
import {Details} from "@hilla/react-components/Details";
import {Button} from "@hilla/react-components/Button";

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

const movieDateDisplayStyle = {
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

const filterSessionUsingTimeFilter = (session: string, timeFilter: string) => {
    return session > timeFilter;
};

export const gridOfMovies = (
    filteredMovies: Movie[],
    expandedMovie: Movie[],
    timeFilter: string,
    ticketDialogOpened: boolean,
    setExpandedMovie: React.Dispatch<React.SetStateAction<Movie[]>>,
    setSelectedDate: React.Dispatch<React.SetStateAction<string>>,
    setSelectedSession: React.Dispatch<React.SetStateAction<string>>,
    setSelectedMovieName: React.Dispatch<React.SetStateAction<string>>,
    setSelectedMovieLanguage: React.Dispatch<React.SetStateAction<string>>,
    setTicketDialogOpened: React.Dispatch<React.SetStateAction<boolean>>) => {

    function getDatesForMovie(movie: Movie,
                              expandedMovie: Movie[],
                              timeFilter: string,
                              setExpandedMovie: React.Dispatch<React.SetStateAction<Movie[]>>) {
        return <Details
            summary="Dates and sessions"
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
                        <Button disabled theme="primary contrast" style={movieDateDisplayStyle}>{date}</Button>
                        {movie.sessions?.filter(session => filterSessionUsingTimeFilter(session ?? "", timeFilter ?? "")).map(session =>
                            <SessionDetail session={session || ""} date={date || ""} movieName={ movie.name|| ""} movieLanguage={movie.language || ""}/>
                        )}
                    </HorizontalLayout>
                ))}
            </VerticalLayout>
        </Details>
    }

    const SessionDetail = ({ date, session, movieName, movieLanguage } : {date:string, session:string, movieName:string, movieLanguage:string}) => {
        const openDialogueForTickets = () => {
            setSelectedDate(date);
            setSelectedSession(session);
            setSelectedMovieName(movieName)
            setSelectedMovieLanguage(movieLanguage);
            setTicketDialogOpened(true);
        };

        let currentDateObject = new Date();
        let currentDateString = currentDateObject.toLocaleDateString().replace("/", ".").split("/")[0];
        let currentTimeString = currentDateObject.toLocaleTimeString().replace(":", ".").split(":")[0];

        if(date.includes(currentDateString) && parseFloat(session) < parseFloat(currentTimeString)){
            return;
        }
        if (!ticketDialogOpened) {
            return (
                <div style={{width: "100%"}}>
                    <Button id={movieName + date + session} theme="secondary contrast" style={sessionButtonDisplayStyle}
                            onClick={openDialogueForTickets}>{session}</Button>
                </div>

            );
        }
        return (<div style={{width: "100%"}}>
            <Button id={movieName + date + session} theme="secondary contrast" style={sessionButtonDisplayStyle}
            >{session}</Button>
        </div>);
    };

    const movieRenderer = ({ item: movie }: { item: Movie }) => (
        <HorizontalLayout theme="spacing margin">
            <img src={movie.imgLocation}
                 style={movieLogoStyle}
                 alt="Displays a movie logo image on the front end to give visual representaition of movie to user."/>

            <VerticalLayout>
                <b style={{width: "100%", paddingLeft: "10px", paddingRight: "10px"}}>
                    {movie.name}
                </b>
                <HorizontalLayout>
                    <span style={{padding: "10px"}}>Genre: {movie.genre}</span>
                    <span style={{padding: "10px"}}>Language: {movie.language}</span>
                    <span style={{padding: "10px"}}>Age restriction: {movie.ageLimit}</span>
                </HorizontalLayout>
                <HorizontalLayout>
                    {getDatesForMovie(movie, expandedMovie, timeFilter, setExpandedMovie)}
                </HorizontalLayout>
            </VerticalLayout>
        </HorizontalLayout>
    );


    return (
        <Grid items={filteredMovies} style={{height: "100%"}}>
            <GridSortColumn>
                {movieRenderer}
            </GridSortColumn>
        </Grid>
    );
};