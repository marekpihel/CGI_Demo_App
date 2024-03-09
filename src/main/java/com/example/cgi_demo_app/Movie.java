package com.example.cgi_demo_app;

public record Movie(
    String name,
    Genre genre,
    int ageLimit,
    Language language){

    public static Movie createMovie(String name, Genre genre, int ageLimit, Language language){
        return new Movie(name, genre, ageLimit, language);
    }

}
