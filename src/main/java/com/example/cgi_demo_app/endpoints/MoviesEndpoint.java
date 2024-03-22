package com.example.cgi_demo_app.endpoints;

import com.example.cgi_demo_app.generators.MovieGenerator;
import com.example.cgi_demo_app.model.Movie;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;

import javax.annotation.Nonnull;
import java.util.ArrayList;

@Endpoint
@AnonymousAllowed
public class MoviesEndpoint {
    MovieGenerator movieGenerator = new MovieGenerator();


    @Nonnull
    public ArrayList<Movie> getMovies(){
        return movieGenerator.getMovies();
    }

}
