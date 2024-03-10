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

        Movie movieForTesting = new Movie("Dune2", Genre.ACTION, 13, Language.ENGLISH, dates, "VAADIN/MovieLogos/" + "Dune2.jpg");
        Movie movieForTesting1 = new Movie("Anyone But You", Genre.ROMANCE, 14, Language.ENGLISH, dates, "VAADIN/MovieLogos/" + "AnyoneButYou.jpg");
        Movie movieForTesting2 = new Movie("Barbie", Genre.FANTASY, 13, Language.SPANISH, dates, "VAADIN/MovieLogos/" + "Barbie.jpg");
        Movie movieForTesting3 = new Movie("Bob Marley: One Love", Genre.DOCUMENTARY, 13, Language.ENGLISH, dates, "VAADIN/MovieLogos/" + "BobMarley.jpg");
        Movie movieForTesting4 = new Movie("Cat & Dog", Genre.ACTION, 13, Language.ENGLISH, dates, "VAADIN/MovieLogos/" + "CatNDog.jpg");
        Movie movieForTesting5 = new Movie("Ferrari", Genre.THRILLER, 13, Language.ENGLISH, dates, "VAADIN/MovieLogos/" + "Ferrari.jpg");
        Movie movieForTesting6 = new Movie("Kung Fu Panda 4", Genre.ACTION, 13, Language.ENGLISH, dates, "VAADIN/MovieLogos/" + "KungFuPanda4.jpg");
        if(!movies.contains(movieForTesting)) movies.add(movieForTesting);
        if(!movies.contains(movieForTesting1)) movies.add(movieForTesting1);
        if(!movies.contains(movieForTesting2)) movies.add(movieForTesting2);
        if(!movies.contains(movieForTesting3)) movies.add(movieForTesting3);
        if(!movies.contains(movieForTesting4)) movies.add(movieForTesting4);
        if(!movies.contains(movieForTesting5)) movies.add(movieForTesting5);
        if(!movies.contains(movieForTesting6)) movies.add(movieForTesting6);
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
