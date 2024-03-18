import Movie from "Frontend/generated/com/example/cgi_demo_app/model/Movie";
import React from "react";
import {Button} from "@hilla/react-components/Button";
import {Notification} from "@hilla/react-components/Notification";
import User from "Frontend/generated/com/example/cgi_demo_app/model/User";


function getRecommendedForUser(movies: Movie[], users: User[], activeUserId: string, setFilteredMovies: React.Dispatch<React.SetStateAction<Movie[]>>){
    let activeUser = users?.filter((user) => activeUserId === user.id) ? users?.filter((user) => activeUserId === user.id) : [];
    let activeUserMovies = activeUser[0].movies ? activeUser[0].movies : [];
    let activeUserGenres: string[] = [];
    let activeUserLanguages: string[] = [];
    let activeUserMovieAgeLimits: number[] = [];
    let totalAgeLimitAge = 0;
    let activeUserAvgAgeLimit = 0;

    if(activeUserMovies.length == 0){
        Notification.show('No watch history', {
            theme: 'warning',
        });
    } else {
        activeUserMovies.forEach((movie) => {
            activeUserGenres.push(movie?.genre ?? "");
            activeUserLanguages.push(movie?.language ?? "");
            activeUserMovieAgeLimits.push(movie?.ageLimit ?? 0);
        });

        //Code taken from https://www.geeksforgeeks.org/javascript-program-to-find-the-most-frequent-element-in-an-array/
        activeUserGenres.sort((a, b) => a.localeCompare(b));
        activeUserLanguages.sort((a, b) => a.localeCompare(b));
        activeUserMovieAgeLimits.sort((a, b) => a-b);

        let activeUserFavouriteGenre = getMostOccurredElement(activeUserGenres);
        let activeUserFavouriteLanguage = getMostOccurredElement(activeUserLanguages);
        activeUserMovieAgeLimits.forEach((age) => totalAgeLimitAge += age);
        activeUserAvgAgeLimit = Math.floor(totalAgeLimitAge/activeUserMovieAgeLimits.length);
        let filteredMoviesAccordingToAge = movies.filter((movie) => movie.ageLimit <= activeUserAvgAgeLimit);
        let filteredMoviesAccordingToLanguage = filteredMoviesAccordingToAge.filter((movie) => movie.language == activeUserFavouriteLanguage);
        let filteredMoviesAccordingToGenre = filteredMoviesAccordingToLanguage.filter(
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
            setFilteredMovies(filteredMoviesAccordingToGenre);
        }
    }
}

//This function has been copied from https://www.geeksforgeeks.org/javascript-program-to-find-the-most-frequent-element-in-an-array/
function getMostOccurredElement(arrayToCheck: any[]) {
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


export const recommendFilter = (
    movies: Movie[],
    users: User[],
    activeUserId: string,
    setFilteredMovies: React.Dispatch<React.SetStateAction<Movie[]>>) => {

    return (
        <Button
            theme="primary"
            style={{backgroundColor: "darkGray", marginTop: "15px"}}
            onClick={() => {getRecommendedForUser(movies, users, activeUserId, setFilteredMovies);}}
        >
            Recommend movies
        </Button>);
};