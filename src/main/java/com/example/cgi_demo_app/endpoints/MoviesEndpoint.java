package com.example.cgi_demo_app.endpoints;

import com.example.cgi_demo_app.*;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;

import java.io.Console;
import java.io.IOException;
import java.lang.reflect.Array;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Endpoint
@AnonymousAllowed
public class MoviesEndpoint {
    ArrayList<Movie> movies = new ArrayList<>();
    HashMap<String, ArrayList> moviesDictionary = new HashMap<>();
    ArrayList<User> users = new ArrayList<>();

    ArrayList<UUID> userUuids = new ArrayList<>();


    public ArrayList<Movie> getMovies(){
        ArrayList<String> dates = new ArrayList<>();
        ArrayList<String> languages = new ArrayList<>();
        ArrayList<String> genres = new ArrayList<>();
        String START_TIME = "08.00";
        String END_TIME = "21.00";

        generateDatesForSessions(END_TIME, dates);

        generateSessionsForDates(dates, START_TIME, END_TIME);

        generateTestingMovies(dates);

        for(Movie movie: movies){
            addValuesToFilterLists(genres, String.valueOf(movie.genre()));
            addValuesToFilterLists(languages, String.valueOf(movie.language()));
        }
        moviesDictionary.put("movies", movies);
        moviesDictionary.put("languages", languages);
        moviesDictionary.put("genres", genres);
        return movies;
    }

    private static void addValuesToFilterLists(ArrayList<String> filterList, String value) {
        if (!filterList.contains(value)) {
            filterList.add(value);
        }
    }

    private void generateSessionsForDates(ArrayList<String> dates, String startTime, String endTime) {
    }

    private static void generateDatesForSessions(String END_TIME, ArrayList<String> dates) {
        Calendar calendar = Calendar.getInstance();
        int today = calendar.get(Calendar.DAY_OF_MONTH);
        int generatedDays = 7;
        int maxDaysInCurrentMonth = Calendar.getInstance().getActualMaximum(Calendar.DAY_OF_MONTH);

        String time = LocalTime.now().format(DateTimeFormatter.ofPattern("HH.mm"));
        if ( Integer.valueOf(time.split("\\.")[0]) > Integer.valueOf(END_TIME.split("\\.")[0]) ||
                (Integer.valueOf(time.split("\\.")[0]) == Integer.valueOf(END_TIME.split("\\.")[0]) &&
                        Integer.valueOf(time.split("\\.")[1]) >= Integer.valueOf(END_TIME.split("\\.")[1]))){
            today += 1;
            today %= maxDaysInCurrentMonth;
        }
        ;
        for (int day = today; day < today+generatedDays; day++) {
            if(day > maxDaysInCurrentMonth){
                dates.add(getDateToAdd(day % maxDaysInCurrentMonth, calendar));
            } else {
                dates.add(getDateToAdd(day, calendar));
            }
        }
    }

    private void generateTestingMovies(ArrayList<String> dates) {
        Movie movieForTesting = new Movie("Dune2", Genre.ACTION, 13, Language.ENGLISH, dates, "VAADIN/MovieLogos/" + "Dune2.jpg");
        Movie movieForTesting1 = new Movie("Anyone But You", Genre.ROMANCE, 14, Language.ENGLISH, dates, "VAADIN/MovieLogos/" + "AnyoneButYou.jpg");
        Movie movieForTesting2 = new Movie("Barbie", Genre.FANTASY, 18, Language.SPANISH, dates, "VAADIN/MovieLogos/" + "Barbie.jpg");
        Movie movieForTesting3 = new Movie("Bob Marley: One Love", Genre.DOCUMENTARY, 13, Language.ENGLISH, dates, "VAADIN/MovieLogos/" + "BobMarley.jpg");
        Movie movieForTesting4 = new Movie("Cat & Dog", Genre.ACTION, 10, Language.ENGLISH, dates, "VAADIN/MovieLogos/" + "CatNDog.jpg");
        Movie movieForTesting5 = new Movie("Ferrari", Genre.THRILLER, 16, Language.ENGLISH, dates, "VAADIN/MovieLogos/" + "Ferrari.jpg");
        Movie movieForTesting6 = new Movie("Kung Fu Panda 4", Genre.ACTION, 5, Language.ENGLISH, dates, "VAADIN/MovieLogos/" + "KungFuPanda4.jpg");
        if(!movies.contains(movieForTesting)) movies.add(movieForTesting);
        if(!movies.contains(movieForTesting1)) movies.add(movieForTesting1);
        if(!movies.contains(movieForTesting2)) movies.add(movieForTesting2);
        if(!movies.contains(movieForTesting3)) movies.add(movieForTesting3);
        if(!movies.contains(movieForTesting4)) movies.add(movieForTesting4);
        if(!movies.contains(movieForTesting5)) movies.add(movieForTesting5);
        if(!movies.contains(movieForTesting6)) movies.add(movieForTesting6);
    }

    private ArrayList getRandomTimesBetween(String startTime, String endTime, boolean isToday) {
        ArrayList<String> sessions;

        String time = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm"));

        if(isToday){
            startTime = "12.00";
        }

        return new ArrayList();
    }

    public ArrayList<String> getLanguages(){
        return moviesDictionary.get("languages");
    }

    public ArrayList<String> getGenres(){
        return moviesDictionary.get("genres");
    }


    private static String getDateToAdd(int day, Calendar calendar) {
        String formattedDay = day < 10 ? "0" + day : String.valueOf(day);
        int month = calendar.get(Calendar.MONTH) + 1;
        String monthToAdd = month < 10 ? "0" + month : String.valueOf(month);

        return formattedDay + "." + monthToAdd + "." + calendar.get(Calendar.YEAR);
    }

    public ArrayList<User> getUsers() throws IOException {
        int generateThisAmountOfUsers = 10;
        NameGenerator nameGenerator = new NameGenerator();

        populateUsersIfThereIsNone(generateThisAmountOfUsers, nameGenerator);

        System.out.println(users.toString());

        return users;
    }

    private void populateUsersIfThereIsNone(int generateThisAmountOfUsers, NameGenerator nameGenerator) throws IOException {
        UUID uuid;
        if(users.isEmpty()) {
            for (int i = 0; i < generateThisAmountOfUsers; i++) {
                uuid = UUID.randomUUID();
                while (userUuids.contains(uuid)) {
                    uuid = UUID.randomUUID();
                    System.out.println("Getting UUID");
                }
                userUuids.add(uuid);

                String fullName = nameGenerator.generateName("src/main/java/com/example/cgi_demo_app/Names.txt");

                User user = new User(uuid,
                        fullName.split(" ")[0],
                        fullName.split(" ")[1],
                        new ArrayList<Movie>());

                users.add(user);
            }
        }
    }

    public ArrayList<Movie> getUserRecommendations(UUID uuid){
        System.out.println("getting recommendations for user: " + uuid);
        for(User user: users){
            if(user.id() == uuid) return user.movies();
        }
        return new ArrayList<>();
    };

    public void addMovieToUser(UUID userUuid, Movie movie) throws IOException {
        for(User user: getUsers()){
            if(user.id() == userUuid){
                user.movies().add(movie);
            }
        }
    }

}
