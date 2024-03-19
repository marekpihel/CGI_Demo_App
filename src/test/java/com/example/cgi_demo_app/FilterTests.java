package com.example.cgi_demo_app;

import com.example.cgi_demo_app.endpoints.FiltersEndpoint;
import com.example.cgi_demo_app.enums.Genre;
import com.example.cgi_demo_app.enums.Language;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;

@SpringBootTest
public class FilterTests {

    @InjectMocks
    private FiltersEndpoint filtersEndpoint;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
    }


    @Test
    void testGenreFilter(){
        Genre[] genresFromEndpoint = filtersEndpoint.getGenres();

        assert Arrays.equals(genresFromEndpoint, Genre.values());
    }

    @Test
    void testLanguageFilter(){
        Language[] languagesFromEndpoint = filtersEndpoint.getLanguages();

        assert Arrays.equals(languagesFromEndpoint, Language.values());
    }
}
