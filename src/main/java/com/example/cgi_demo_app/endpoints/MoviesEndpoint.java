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

    ArrayList<String> movieNames = new ArrayList<>();
    HashMap<String, ArrayList> moviesDictionary = new HashMap<>();
    ArrayList<User> users = new ArrayList<>();

    ArrayList<UUID> userUuids = new ArrayList<>();

    String START_TIME = "08.00";
    String END_TIME = "21.00";


    @Nonnull
    public ArrayList<Movie> getMovies() throws IOException {
        ArrayList<String> dates = new ArrayList<>();
        ArrayList<String> languages = new ArrayList<>();
        ArrayList<String> genres = new ArrayList<>();

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
                timeToNextSession = round(random.nextDouble(), 2);
            } else {
                timeToNextSession += round(timeBetweenTwoSessionStarts + random.nextDouble() * 2 - 1, 2);
            }

            if(startTime + timeToNextSession > endTime){
                sessionsAsDouble.add(endTime);
            } else {
                sessionsAsDouble.add(startTime + timeToNextSession);
            }
        }


        for(double session: sessionsAsDouble){
            //To explain the code a bit we generate string value of the float in regular 60th system according to our time keeping
            //First if statement adds zero in front if first value is not 2 digit one
            //Second if statement adds zero to the beginning of minutes if some edge cases happen
            String sessionStringToAdd = "";
            if(session < 10){
                sessionStringToAdd += "0";
            }
            int minutes = (int)((session - (int) session) * 60);
            sessionStringToAdd += (int) session + ".";

            if(minutes < 10){
                sessionStringToAdd += "0" + minutes;
            } else {
                sessionStringToAdd += minutes;
            }
            sessions.add(sessionStringToAdd);

        }

        return sessions;
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
        ArrayList<String> sessions = generateSessionsForDates(Double.valueOf(START_TIME), Double.valueOf(END_TIME), 8);


        Movie movieForTesting = generateMovie("Dune2", Genre.ACTION, 13, Language.ENGLISH,  dates, "https://images.markus.live/mcswebsites.blob.core.windows.net/1013/Event_8157/landscape_fullhd/Dune2_Apollo_EHDh_3840x2160.jpg", 7);
        Movie movieForTesting1 = generateMovie("Anyone But You", Genre.ROMANCE, 14, Language.ENGLISH, dates, "https://images.markus.live/mcswebsites.blob.core.windows.net/1013/Event_8824/landscape_qhd/AnyoneButYou_Digi_Landsc_1920x1080_EE(1).jpg", 5);
        Movie movieForTesting2 = generateMovie("Barbie", Genre.FANTASY, 18, Language.SPANISH, dates, "https://images.markus.live/mcswebsites.blob.core.windows.net/1013/Event_8324/landscape_fullhd/Barbie_Apollo_EHDh_3840x2160_EE.jpg", 3);
        Movie movieForTesting3 = generateMovie("Bob Marley: One Love", Genre.DOCUMENTARY, 13, Language.ENGLISH, dates, "https://images.markus.live/mcswebsites.blob.core.windows.net/1013/Event_8493/landscape_fullhd/BobMarley_3840x2160.jpg", 4);
        Movie movieForTesting4 = generateMovie("Cat & Dog", Genre.ACTION, 10, Language.ENGLISH, dates, "https://images.markus.live/mcswebsites.blob.core.windows.net/1013/Event_8898/landscape_fullhd/Cat&Dog_EE_Apollo_EHDh_3840x2160.jpg", 8);
        Movie movieForTesting5 = generateMovie("Ferrari", Genre.THRILLER, 16, Language.ENGLISH, dates, "https://images.markus.live/mcswebsites.blob.core.windows.net/1013/Event_8536/landscape_qhd/Ferrari_Digi_Landsc_1920x1080_EE_Main.jpg", 6);
        Movie movieForTesting6 = generateMovie("Kung Fu Panda 4", Genre.ACTION, 5, Language.ENGLISH, dates, "https://images.markus.live/mcswebsites.blob.core.windows.net/1013/Event_8705/landscape_fullhd/KungFuPanda4_3840x2160.jpg", 10);

        addNonDuplicateMoviesToMoviesList(movieForTesting);
        addNonDuplicateMoviesToMoviesList(movieForTesting1);
        addNonDuplicateMoviesToMoviesList(movieForTesting2);
        addNonDuplicateMoviesToMoviesList(movieForTesting3);
        addNonDuplicateMoviesToMoviesList(movieForTesting4);
        addNonDuplicateMoviesToMoviesList(movieForTesting5);
        addNonDuplicateMoviesToMoviesList(movieForTesting6);
    }

    public void addNonDuplicateMoviesToMoviesList(Movie movieForTesting) {
        if(!movieNames.contains(movieForTesting.name())) {
            movies.add(movieForTesting);
            movieNames.add(movieForTesting.name());
        }
    }

    private Movie generateMovie(String name, Genre genre, int ageLimit,Language language, ArrayList dates, String imgLocation, int sessionsPerDay){
        return new Movie(name, genre, ageLimit,language, dates, generateSessionsForDates(Double.valueOf(START_TIME), Double.valueOf(END_TIME),sessionsPerDay),imgLocation);
    }

    @Nonnull
    public Language[] getLanguages(){
        return Language.values();
    }

    @Nonnull
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
