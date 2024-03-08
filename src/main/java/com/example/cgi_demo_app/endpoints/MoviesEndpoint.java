package com.example.cgi_demo_app.endpoints;

import com.example.cgi_demo_app.Movie;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.logging.Logger;

@Endpoint
@AnonymousAllowed
public class MoviesEndpoint {
    ArrayList<String> movies = new ArrayList<>();


    public ArrayList<String> getMovies() {

        return movies;
    }

    public void addMovie(String name){
        if(!movies.contains(name)){
            movies.add(name);
        }

    }

}
