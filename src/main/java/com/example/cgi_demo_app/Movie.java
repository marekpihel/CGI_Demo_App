package com.example.cgi_demo_app;

import java.util.ArrayList;

public record Movie(
        String name,
        Genre genre,
        int ageLimit,
        Language language,
        String dates,
        String imgLocation){

    public static Movie createMovie(String name, Genre genre, int ageLimit, Language language, String dates, String imgLocation){
        return new Movie(name, genre, ageLimit, language, dates, imgLocation);
    }

}
