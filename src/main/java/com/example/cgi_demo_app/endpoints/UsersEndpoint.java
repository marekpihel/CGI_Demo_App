package com.example.cgi_demo_app.endpoints;

import com.example.cgi_demo_app.model.User;
import com.example.cgi_demo_app.generators.UserGenerator;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;

import javax.annotation.Nonnull;
import java.io.IOException;
import java.util.ArrayList;


@Endpoint
@AnonymousAllowed
public class UsersEndpoint {
    UserGenerator userGenerator = new UserGenerator();

    @Nonnull
    public ArrayList<User> getUsers() throws IOException {
        return userGenerator.getUsers();
    }

}
