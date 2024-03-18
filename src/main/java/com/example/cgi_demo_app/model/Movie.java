package com.example.cgi_demo_app.model;

import com.example.cgi_demo_app.enums.Genre;
import com.example.cgi_demo_app.enums.Language;

import java.util.ArrayList;

public record Movie(
        String name,
        Genre genre,
        int ageLimit,
        Language language,
        ArrayList<String> dates,
        ArrayList<String> sessions,
        String imgLocation){

    public static Movie createMovie(String name,
                                    Genre genre,
                                    int ageLimit,
                                    Language language,
                                    ArrayList<String> dates,
                                    ArrayList<String> sessions,
                                    String imgLocation){

        return new Movie(name,
                genre,
                ageLimit,
                language,
                dates,
                sessions,
                imgLocation);
    }

}
