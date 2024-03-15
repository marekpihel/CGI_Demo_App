package com.example.cgi_demo_app.endpoints;


import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;

import javax.annotation.Nonnull;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

@Endpoint
@AnonymousAllowed
public class SeatingEndpoint {

    HashMap<String, List<List<Integer>>> movieSessionSeatingInfo = new HashMap<>();

    //movieInformation is composed of "movieName,movieDate,movieSession,movieLanguage"
    //Seating will have:
    //      0 for available
    //      1 for taken
    @Nonnull
    public List<List<Integer>> getSeating(String movieInformation){
        List<List<Integer>> seating = new ArrayList<>();

        System.out.println(movieInformation);

        seating.add(List.of(0,0,0,0,0,0,1,0,1,0));
        seating.add(List.of(1,0,0,1,0,0,1,0,1,0));
        seating.add(List.of(0,1,0,1,0,0,1,0,1,0));
        seating.add(List.of(0,0,0,0,0,0,0,0,1,0));
        seating.add(List.of(0,0,0,0,0,0,0,0,0,0));
        movieSessionSeatingInfo.put(movieInformation, seating);

        if(movieSessionSeatingInfo.containsKey(movieInformation)){
            return movieSessionSeatingInfo.get(movieInformation);
        } else {
            return seating;
        }

    }

    private ArrayList<ArrayList<Integer>> generateRandomSeating(int rows, int columns){
        ArrayList<ArrayList<Integer>> generatedSeating = new ArrayList<>();
        Random random = new Random();

        //Todo add some random seating generation
        return generatedSeating;
    }
}
