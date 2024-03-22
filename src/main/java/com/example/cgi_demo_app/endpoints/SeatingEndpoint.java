package com.example.cgi_demo_app.endpoints;


import com.example.cgi_demo_app.generators.SeatingGenerator;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;

import javax.annotation.Nonnull;
import java.util.List;

@Endpoint
@AnonymousAllowed
public class SeatingEndpoint {
    SeatingGenerator seatingGenerator = new SeatingGenerator();

    @Nonnull
    public List<List<Integer>> getSeating(String movieInformation) {
        return seatingGenerator.getSeatingForMovieSession(movieInformation);
    }

    public void addSeatsToSeating(List<List<Integer>> seatsToBook, String movieInformation) {
        seatingGenerator.addSeatsToSeating(seatsToBook, movieInformation);
    }

}
