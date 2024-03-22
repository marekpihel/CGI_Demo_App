package com.example.cgi_demo_app.endpoints;

import com.example.cgi_demo_app.enums.Genre;
import com.example.cgi_demo_app.enums.Language;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;

import javax.annotation.Nonnull;

@Endpoint
@AnonymousAllowed
public class FiltersEndpoint {
    @Nonnull
    public Language[] getLanguages() {
        return Language.values();
    }

    @Nonnull
    public Genre[] getGenres() {
        return Genre.values();
    }
}
