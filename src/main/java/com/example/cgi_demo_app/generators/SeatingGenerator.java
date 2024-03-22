package com.example.cgi_demo_app.generators;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

public class SeatingGenerator {
    HashMap<String, List<List<Integer>>> movieSessionSeatingInfo = new HashMap<>();

    //movieInformation is composed of "movieName,movieDate,movieSession,movieLanguage"
    //Seating will have:
    //      0 for available
    //      1 for taken
    public List<List<Integer>> getSeatingForMovieSession(String movieInformation) {
        int seatRows = 10;
        int seatColumns = 10;


        if (!movieSessionSeatingInfo.containsKey(movieInformation)) {
            movieSessionSeatingInfo.put(movieInformation, generateRandomSeating(seatRows, seatColumns));
        }

        return movieSessionSeatingInfo.get(movieInformation);
    }

    private List<List<Integer>> generateRandomSeating(int rows, int columns) {
        List<List<Integer>> generatedSeating = new ArrayList<>();
        Random random = new Random();
        int percentageFilled = random.nextInt(101);
        int totalSeats = rows * columns;
        int seatsToFill = totalSeats * percentageFilled / 100;

        initializeSeats(generatedSeating, rows, columns);

        while (seatsToFill > 0) {
            int row = random.nextInt(rows);
            int column = random.nextInt(columns);
            int seatStatus = generatedSeating.get(row).get(column);
            if (seatStatus == 0) {
                generatedSeating.get(row).set(column, 1);
                seatsToFill--;
            }
        }

        //Todo add some random seating generation
        return generatedSeating;
    }

    private void initializeSeats(List<List<Integer>> generatedSeating, int rows, int columns) {
        for (int row = 0; row < rows; row++) {
            List<Integer> currentRow = new ArrayList<>();
            for (int column = 0; column < columns; column++) {
                currentRow.add(0);
            }
            generatedSeating.add(currentRow);
        }
    }

    public void addSeatsToSeating(List<List<Integer>> seatsToBook, String movieInformation) {
        List<List<Integer>> movieSeating = movieSessionSeatingInfo.get(movieInformation);

        for (List<Integer> seat : seatsToBook) {
            int row = seat.get(0);
            int column = seat.get(1);
            List<Integer> rowList = movieSeating.get(row);
            rowList.set(column, 1);
        }

        movieSessionSeatingInfo.put(movieInformation, movieSeating);
    }
}
