package com.example.cgi_demo_app;

import com.example.cgi_demo_app.endpoints.SeatingEndpoint;
import com.example.cgi_demo_app.generators.SeatingGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@SpringBootTest
public class SeatingTests {
    @Mock
    private SeatingGenerator seatingGenerator;

    @InjectMocks
    private SeatingEndpoint seatingEndpoint;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
    }

    List<List<Integer>> mockSeating = Arrays.asList(
            Arrays.asList(0, 0, 0, 0, 0),
            Arrays.asList(0, 1, 0, 0, 0),
            Arrays.asList(0, 0, 1, 0, 0),
            Arrays.asList(0, 0, 0, 1, 0),
            Arrays.asList(0, 0, 0, 0, 0)
    );
    String movieInformation = "TestMovie";

    @Test
    void testGetSeating() {
        when(seatingGenerator.getSeatingForMovieSession(movieInformation)).thenReturn(mockSeating);

        List<List<Integer>> seatingFromEndpoint = seatingEndpoint.getSeating(movieInformation);

        assertEquals(mockSeating, seatingFromEndpoint);
    }

    @Test
    void testAddSeatChangesSeating() {
        SeatingEndpoint realEndpoint = new SeatingEndpoint();
        List<List<Integer>> seating = new ArrayList<>(realEndpoint.getSeating(movieInformation));
        List<List<Integer>> freeSeats = new ArrayList<>();

        for (int row = 0; row < seating.size(); row++) {
            for (int column = 0; column < seating.get(row).size(); column++) {
                if (seating.get(row).get(column) == 0) {
                    if (freeSeats.size() < 5) {
                        freeSeats.add(new ArrayList<>(Arrays.asList(row, column)));
                    }
                }
            }
        }

        realEndpoint.addSeatsToSeating(freeSeats, movieInformation);

        boolean seatingChanged = true;
        for (List<Integer> seat : freeSeats) {
            if (seating.get(seat.get(0)).get(seat.get(1)) != 1) {
                seatingChanged = false;
                break;
            }
        }

        assertEquals(true, seatingChanged);
    }

}
