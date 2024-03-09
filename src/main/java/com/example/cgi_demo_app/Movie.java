package com.example.cgi_demo_app;

import java.util.ArrayList;
import java.util.Date;

public record Movie(
        String name,
        Genre genre,
        int ageLimit,
        Language language,
        ArrayList<String> dates){

    public static Movie createMovie(String name, Genre genre, int ageLimit, Language language, ArrayList<String> dates){
        return new Movie(name, genre, ageLimit, language, dates);
    }

}
