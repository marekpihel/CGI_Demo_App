package com.example.cgi_demo_app.endpoints;

import com.example.cgi_demo_app.Genre;
import com.example.cgi_demo_app.Language;
import com.example.cgi_demo_app.Movie;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;

import java.util.ArrayList;
import java.util.Calendar;

@Endpoint
@AnonymousAllowed
public class MoviesEndpoint {
    ArrayList<Movie> movies = new ArrayList<>();


    public ArrayList<Movie> getMovies() {
        ArrayList<Integer> dates = new ArrayList<>();
        int today = Calendar.DAY_OF_MONTH;
        int generatedDays = 7;
        int maxDaysInCurrentMonth = Calendar.getInstance().getActualMaximum(Calendar.DAY_OF_MONTH);
        for (int i = today; i < today+generatedDays; i++) {
            if(i > maxDaysInCurrentMonth){
                dates.add(i % maxDaysInCurrentMonth);
            } else {
                dates.add(i);
            }
        }
        movies.add(new Movie("Dune", Genre.ACTION, 13, Language.ENGLISH));
        return movies;
    }

    public void addMovie(String name){
        //Todo possibly?

    }

}
