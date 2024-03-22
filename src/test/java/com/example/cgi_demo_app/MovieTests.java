package com.example.cgi_demo_app;

import com.example.cgi_demo_app.endpoints.MoviesEndpoint;
import com.example.cgi_demo_app.enums.Genre;
import com.example.cgi_demo_app.enums.Language;
import com.example.cgi_demo_app.generators.MovieGenerator;
import com.example.cgi_demo_app.model.Movie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@SpringBootTest
public class MovieTests {

    @Mock
    private MovieGenerator movieGenerator;

    @InjectMocks
    private MoviesEndpoint moviesEndpoint;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
    }

    ArrayList<Movie> mockMovies = new ArrayList<>();

    @Test
    void testCreateMovieCreatesMovie() {
        Movie movie = Movie.createMovie("Testmovie",
                Genre.ACTION,
                18,
                Language.ENGLISH,
                new ArrayList<>(),
                new ArrayList<>(),
                "",
                "1:30");

        assertEquals(Movie.class, movie.getClass());
    }

    @Test
    void testGetMoviesEndpoint() {
        Movie movie = new Movie("Testmovie",
                Genre.ACTION,
                18,
                Language.ENGLISH,
                new ArrayList<>(),
                new ArrayList<>(),
                "",
                "1:30");
        mockMovies.add(movie);

        when(movieGenerator.getMovies()).thenReturn(mockMovies);

        ArrayList<Movie> moviesFromEndpoint = moviesEndpoint.getMovies();

        assertEquals(mockMovies, moviesFromEndpoint);
    }

    @Test
    void testGetMoviesGenerator() {
        MovieGenerator realMoviesGenerator = new MovieGenerator();
        List<Movie> realMovies = realMoviesGenerator.getMovies();
        int moviesAmount = 8;

        assertEquals(moviesAmount, realMovies.size());
    }

    @Test
    void testGenerateMovie() {
        Movie movie = new Movie("Testmovie",
                Genre.ACTION,
                18,
                Language.ENGLISH,
                new ArrayList<>(),
                new ArrayList<>(),
                "",
                "1:30");
        MovieGenerator realMoviesGenerator = new MovieGenerator();

        Movie generatedMovie = realMoviesGenerator.generateMovie(movie.name(),
                movie.genre(),
                movie.ageLimit(),
                movie.language(),
                movie.dates(),
                movie.imgLocation(),
                10,
                movie.duration());

        movie.sessions().addAll(generatedMovie.sessions());

        assertEquals(movie, generatedMovie);
    }

    @Test
    void testGenerateRandomAmountOfMovies() {
        MovieGenerator movieGenerator1 = new MovieGenerator();
        ArrayList<Movie> movies = new ArrayList<>();
        int generateAmountOfMovies = 10;

        movieGenerator1.generateRandomMovies(generateAmountOfMovies, movies);

        assertEquals(generateAmountOfMovies, movies.size());
    }

    @Test
    void testRoundingRoundsToTwoPoints() {
        MovieGenerator movieGenerator1 = new MovieGenerator();
        double initialValue = 0.323;
        double roundedValue = movieGenerator1.round(initialValue, 2);

        assertEquals(0.32, roundedValue);
    }
}
