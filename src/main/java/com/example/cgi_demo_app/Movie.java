package com.example.cgi_demo_app;

import java.util.ArrayList;
import java.util.Arrays;

public record Movie(
        String name,
        Genre genre,
        int ageLimit,
        Language language,
        ArrayList<String> dates,
        ArrayList<String> sessions,
        String imgLocation){

    public static Movie createMovie(String name, Genre genre, int ageLimit, Language language, ArrayList<String> dates, ArrayList<String> sessions, String imgLocation){
        return new Movie(name, genre, ageLimit, language, dates, sessions, imgLocation);
    }

}
