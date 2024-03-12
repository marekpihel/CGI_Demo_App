package com.example.cgi_demo_app.endpoints;

import com.example.cgi_demo_app.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import dev.hilla.Nonnull;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
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


    @Nonnull
    public ArrayList<Movie> getMovies() throws IOException {
        ArrayList<String> dates = new ArrayList<>();
        ArrayList<String> languages = new ArrayList<>();
        ArrayList<String> genres = new ArrayList<>();
        String START_TIME = "08.00";
        String END_TIME = "21.00";

        generateDatesForSessions(END_TIME, dates);

        generateTestingMovies(dates, START_TIME, END_TIME);

        for(Movie movie: movies){
            addValueToFilterList(genres, String.valueOf(movie.genre()));
            addValueToFilterList(languages, String.valueOf(movie.language()));
        }
        moviesDictionary.put("movies", movies);
        moviesDictionary.put("languages", languages);
        moviesDictionary.put("genres", genres);
        return movies;
    }

    private static void addValueToFilterList(ArrayList<String> filterList, String value) {
        if (!filterList.contains(value)) {
            filterList.add(value);
        }
    }

    private ArrayList<String> generateSessionsForDates(double startTime, double endTime, int sessionsPerDay) {
        ArrayList<Double> sessionsAsDouble = new ArrayList<>();
        ArrayList<String> sessions = new ArrayList<>();
        Random random = new Random();

        double totalHours = endTime-startTime;
        double timeBetweenTwoSessionStarts = (double) Math.round((totalHours / sessionsPerDay) * 100) / 100;
        double timeToNextSession = 0;


        for (int i = 0; i < sessionsPerDay; i++) {
            if(i == 0){
                timeToNextSession = round(random.nextDouble() * 2 - 1, 2);
            } else {
                timeToNextSession += round(timeBetweenTwoSessionStarts + random.nextDouble() * 2 - 1, 2);
            }


            sessionsAsDouble.add(startTime + timeToNextSession);
        }

        Collections.sort(sessionsAsDouble);
        System.out.println(sessionsAsDouble);

        return new ArrayList();
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

    private void generateTestingMovies(ArrayList<String> dates, String START_TIME, String END_TIME) throws IOException {
        HashMap<String, ArrayList> datesAndSessions = new HashMap<>();
        datesAndSessions.put("dates", dates);

        ArrayList<String> sessions = generateSessionsForDates(Double.valueOf(START_TIME), Double.valueOf(END_TIME), 8);
        datesAndSessions.put("sessions", sessions);
        ObjectMapper objectMapper = new ObjectMapper();
        String jacksonData = objectMapper.writeValueAsString(datesAndSessions);

        Movie movieForTesting = new Movie("Dune2", Genre.ACTION, 13, Language.ENGLISH,  jacksonData, "https://images.markus.live/mcswebsites.blob.core.windows.net/1013/Event_8157/landscape_fullhd/Dune2_Apollo_EHDh_3840x2160.jpg");
        Movie movieForTesting1 = new Movie("Anyone But You", Genre.ROMANCE, 14, Language.ENGLISH, jacksonData, "https://images.markus.live/mcswebsites.blob.core.windows.net/1013/Event_8824/landscape_qhd/AnyoneButYou_Digi_Landsc_1920x1080_EE(1).jpg");
        Movie movieForTesting2 = new Movie("Barbie", Genre.FANTASY, 18, Language.SPANISH, jacksonData, "https://images.markus.live/mcswebsites.blob.core.windows.net/1013/Event_8324/landscape_fullhd/Barbie_Apollo_EHDh_3840x2160_EE.jpg");
        Movie movieForTesting3 = new Movie("Bob Marley: One Love", Genre.DOCUMENTARY, 13, Language.ENGLISH, jacksonData, "https://images.markus.live/mcswebsites.blob.core.windows.net/1013/Event_8493/landscape_fullhd/BobMarley_3840x2160.jpg");
        Movie movieForTesting4 = new Movie("Cat & Dog", Genre.ACTION, 10, Language.ENGLISH, jacksonData, "https://images.markus.live/mcswebsites.blob.core.windows.net/1013/Event_8898/landscape_fullhd/Cat&Dog_EE_Apollo_EHDh_3840x2160.jpg");
        Movie movieForTesting5 = new Movie("Ferrari", Genre.THRILLER, 16, Language.ENGLISH, jacksonData, "https://images.markus.live/mcswebsites.blob.core.windows.net/1013/Event_8536/landscape_qhd/Ferrari_Digi_Landsc_1920x1080_EE_Main.jpg");
        Movie movieForTesting6 = new Movie("Kung Fu Panda 4", Genre.ACTION, 5, Language.ENGLISH, jacksonData, "https://images.markus.live/mcswebsites.blob.core.windows.net/1013/Event_8705/landscape_fullhd/KungFuPanda4_3840x2160.jpg");
        if(!movies.contains(movieForTesting)) movies.add(movieForTesting);
        if(!movies.contains(movieForTesting1)) movies.add(movieForTesting1);
        if(!movies.contains(movieForTesting2)) movies.add(movieForTesting2);
        if(!movies.contains(movieForTesting3)) movies.add(movieForTesting3);
        if(!movies.contains(movieForTesting4)) movies.add(movieForTesting4);
        if(!movies.contains(movieForTesting5)) movies.add(movieForTesting5);
        if(!movies.contains(movieForTesting6)) movies.add(movieForTesting6);
    }

    public Language[] getLanguages(){
        return Language.values();
    }

    public Genre[] getGenres(){
        return Genre.values();
    }


    private static String getDateToAdd(int day, Calendar calendar) {
        String formattedDay = day < 10 ? "0" + day : String.valueOf(day);
        int month = calendar.get(Calendar.MONTH) + 1;
        String monthToAdd = month < 10 ? "0" + month : String.valueOf(month);

        return formattedDay + "." + monthToAdd + "." + calendar.get(Calendar.YEAR);
    }

    @Nonnull
    public ArrayList<User> getUsers() throws IOException {
        int generateThisAmountOfUsers = 10;
        NameGenerator nameGenerator = new NameGenerator();

        populateUsersIfThereIsNone(generateThisAmountOfUsers, nameGenerator);

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


    //Kood võetud https://stackoverflow.com/questions/2808535/round-a-double-to-2-decimal-places
    // üks ühele kopeeritud funktsionaalsuse jaoks ainult
    public static double round(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();

        BigDecimal bd = BigDecimal.valueOf(value);
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }

}
