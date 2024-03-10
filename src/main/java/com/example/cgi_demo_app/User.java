package com.example.cgi_demo_app;

import java.util.ArrayList;
import java.util.UUID;

public record User(
        UUID id,
        String firstName,
        String lastName
        ){

    public static User createUser(String firstName, String lastName, UUID id){
        return new User(id, firstName, lastName);
    }

}
