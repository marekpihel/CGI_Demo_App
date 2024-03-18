package com.example.cgi_demo_app.model;

import java.util.ArrayList;
import java.util.UUID;

public record User(
        UUID id,
        String firstName,
        String lastName,
        ArrayList<Movie> movies
        ){

    public static User createUser(String firstName,
                                  String lastName,
                                  UUID id,
                                  ArrayList<Movie> movies){

        return new User(id,
                firstName,
                lastName,
                movies);
    }

}
