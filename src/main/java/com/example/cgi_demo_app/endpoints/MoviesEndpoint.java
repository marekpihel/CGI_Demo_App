package com.example.cgi_demo_app.endpoints;

import com.example.cgi_demo_app.Genre;
import com.example.cgi_demo_app.Language;
import com.example.cgi_demo_app.Movie;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

@Endpoint
@AnonymousAllowed
public class MoviesEndpoint {
    ArrayList<Movie> movies = new ArrayList<>();


    public ArrayList<Movie> getMovies() {
        ArrayList<String> dates = new ArrayList<>();
        Calendar calendar = Calendar.getInstance();
        int today = calendar.get(Calendar.DAY_OF_MONTH);
        int generatedDays = 7;
        int maxDaysInCurrentMonth = Calendar.getInstance().getActualMaximum(Calendar.DAY_OF_MONTH);
        for (int day = today; day < today+generatedDays; day++) {
            if(day > maxDaysInCurrentMonth){
                dates.add(getDateToAdd(day % maxDaysInCurrentMonth, calendar));
            } else {
                dates.add(getDateToAdd(day, calendar));
            }
        }

        Movie movieForTesting = new Movie("Dune", Genre.ACTION, 13, Language.ENGLISH, dates);
        Movie movieForTesting1 = new Movie("Dune2", Genre.ACTION, 14, Language.ENGLISH, dates);
        Movie movieForTesting2 = new Movie("Dune3", Genre.ACTION, 13, Language.SPANISH, dates);
        Movie movieForTesting3 = new Movie("Dune4", Genre.ACTION, 13, Language.ENGLISH, dates);
        if(!movies.contains(movieForTesting)) movies.add(movieForTesting);
        if(!movies.contains(movieForTesting1)) movies.add(movieForTesting1);
        if(!movies.contains(movieForTesting2)) movies.add(movieForTesting2);
        if(!movies.contains(movieForTesting3)) movies.add(movieForTesting3);
        return movies;
    }

    private static String getDateToAdd(int day, Calendar calendar) {
        String formattedDay = day < 10 ? "0" + day : String.valueOf(day);
        String month = calendar.get(Calendar.MONTH) < 10 ? "0" + calendar.get(Calendar.MONTH) : String.valueOf(calendar.get(Calendar.MONTH));

        return formattedDay + "." + month + "." + calendar.get(Calendar.YEAR);
    }

    public void addMovie(String name){
        //Todo possibly?

    }

}
