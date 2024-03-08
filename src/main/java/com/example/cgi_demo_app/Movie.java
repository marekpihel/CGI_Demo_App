package com.example.cgi_demo_app;

import java.lang.reflect.GenericArrayType;
import java.util.ArrayList;

public class Movie {
    public enum Genre {
        ACTION,
        COMEDY,
        DOCUMENTARY,
        FANTASY,
        ROMANCE,
        THRILLER,
        DRAMA,
        HORROR,
        ADVENTURE
    }

    public enum Language{
        ENGLISH,
        ESTONIAN,
        GERMAN,
        FRENCH,
        SPANISH
    }
    String name;
    Genre genre;
    int ageLimit;
    Language language;
    ArrayList<Integer> dates;

    public Movie(String name, Genre genre, int ageLimit, Language language, ArrayList<Integer> dates){
        this.name = name;
        this.genre = genre;
        this.ageLimit = ageLimit;
        this.language = language;
        this.dates = dates;
    }

}
