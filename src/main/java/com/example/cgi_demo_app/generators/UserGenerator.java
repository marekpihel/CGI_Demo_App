package com.example.cgi_demo_app.generators;

import com.example.cgi_demo_app.model.Movie;
import com.example.cgi_demo_app.model.User;

import java.io.IOException;
import java.util.ArrayList;
import java.util.UUID;

public class UserGenerator {
    ArrayList<UUID> userUuids = new ArrayList<>();
    MovieGenerator movieGenerator = new MovieGenerator();
    ArrayList<User> users = new ArrayList<>();

    public ArrayList<User> getUsers() throws IOException {
        populateUsersIfThereIsNone();
        return users;
    }

    public void populateUsersIfThereIsNone() throws IOException {
        UUID uuid;
        int generateAmountOfMovies = 10;
        int generateThisAmountOfUsers = 10;
        NameGenerator nameGenerator = new NameGenerator();


        if(users.isEmpty()) {
            for (int i = 0; i < generateThisAmountOfUsers; i++) {
                uuid = UUID.randomUUID();
                ArrayList<Movie> userMovies = new ArrayList<>();

                while (userUuids.contains(uuid)) {
                    uuid = UUID.randomUUID();
                }

                userUuids.add(uuid);

                String fullName = nameGenerator.generateName("src/main/resources/static/Names.txt");

                movieGenerator.generateRandomMoviesForUser(generateAmountOfMovies, userMovies);

                User user = new User(uuid,
                        fullName.split(" ")[0],
                        fullName.split(" ")[1],
                        userMovies);

                users.add(user);
            }
        }
    }

}
