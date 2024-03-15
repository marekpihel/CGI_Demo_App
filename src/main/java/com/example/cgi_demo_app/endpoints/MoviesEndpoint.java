package com.example.cgi_demo_app.endpoints;

import com.example.cgi_demo_app.*;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import javax.annotation.Nonnull;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
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
        ArrayList<Movie> generatedMoviesList = new ArrayList<>();


        generatedMoviesList.add(generateMovie("Dune: Part Two ", Genre.ACTION, 13, Language.ENGLISH,  dates, "/pictures/movie_logos/Dune2.jpg", 7));
        generatedMoviesList.add(generateMovie("Anyone But You", Genre.ROMANCE, 14, Language.ENGLISH, dates, "/pictures/movie_logos/AnyoneButYou.jpg", 5));
        generatedMoviesList.add(generateMovie("Barbie", Genre.FANTASY, 18, Language.SPANISH, dates, "/pictures/movie_logos/Barbie.jpg", 3));
        generatedMoviesList.add(generateMovie("Barbie", Genre.FANTASY, 18, Language.ENGLISH, dates, "/pictures/movie_logos/Barbie.jpg", 3));
        generatedMoviesList.add(generateMovie("Bob Marley: One Love", Genre.DOCUMENTARY, 13, Language.ENGLISH, dates, "/pictures/movie_logos/BobMarley.jpg", 4));
        generatedMoviesList.add(generateMovie("Cat & Dog", Genre.ACTION, 10, Language.ENGLISH, dates, "/pictures/movie_logos/CatNDog.jpg", 8));
        generatedMoviesList.add(generateMovie("Ferrari", Genre.THRILLER, 16, Language.ENGLISH, dates, "/pictures/movie_logos/Ferrari.jpg", 6));
        generatedMoviesList.add(generateMovie("Kung Fu Panda 4", Genre.ACTION, 5, Language.ENGLISH, dates, "/pictures/movie_logos/KungFuPanda4.jpg", 10));
        //This line generate completely random movies with no real life counterparts so this can be used to generate movies for frontend testing
        // but this doesn't generate dates or sessions so this can only be used to test the recommendation algorithm.
        //generateRandomMoviesForUser(20, generatedMoviesList);

        for(Movie movie: generatedMoviesList){
            addNonDuplicateMoviesToMoviesList(movie);
        }
    }

    public void addNonDuplicateMoviesToMoviesList(Movie movieForTesting) {
        if(!movieNames.contains(movieForTesting.name()+movieForTesting.language())) {
            movies.add(movieForTesting);
            movieNames.add(movieForTesting.name()+movieForTesting.language());
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
        int generateAmountOfMovies = 10;


        if(users.isEmpty()) {
            for (int i = 0; i < generateThisAmountOfUsers; i++) {
                uuid = UUID.randomUUID();
                ArrayList<Movie> userMovies = new ArrayList<>();

                while (userUuids.contains(uuid)) {
                    uuid = UUID.randomUUID();
                }

                userUuids.add(uuid);

                String fullName = nameGenerator.generateName("src/main/java/com/example/cgi_demo_app/Names.txt");

                generateRandomMoviesForUser(generateAmountOfMovies, userMovies);

                User user = new User(uuid,
                        fullName.split(" ")[0],
                        fullName.split(" ")[1],
                        userMovies);

                users.add(user);
            }
        }
    }

    private void generateRandomMoviesForUser(int generateAmountOfMovies, ArrayList<Movie> userMovies) {
        //Taken from https://www.baeldung.com/java-random-string
        int leftLimit = 97; // letter 'a'
        int rightLimit = 122; // letter 'z'
        int targetStringLength = 10;
        Random random = new Random();

        for (int j = 0; j < generateAmountOfMovies; j++) {
            String generatedMovieString = random.ints(leftLimit, rightLimit + 1)
                    .limit(targetStringLength)
                    .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                    .toString();
            int ageLimit = random.nextInt(18);


            userMovies.add(generateMovie(generatedMovieString,
                                                Genre.values()[random.nextInt(Genre.values().length)],
                                                ageLimit,
                                                Language.values()[random.nextInt(Language.values().length)],
                                                new ArrayList<>(),
                                                "",
                                                0));
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
