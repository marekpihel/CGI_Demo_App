package com.example.cgi_demo_app.generators;

import com.example.cgi_demo_app.enums.Genre;
import com.example.cgi_demo_app.enums.Language;
import com.example.cgi_demo_app.model.Movie;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Objects;
import java.util.Random;

public class MovieGenerator {
    String START_TIME = "08.00";
    String END_TIME = "21.00";
    ArrayList<String> movieNames = new ArrayList<>();
    ArrayList<Movie> movies = new ArrayList<>();
    ArrayList<String> dates = new ArrayList<>();

    public ArrayList<Movie> getMovies() {
        generateDatesForSessions();
        generateTestingMovies(dates);
        return movies;
    }

    public void generateTestingMovies(ArrayList<String> dates) {
        ArrayList<Movie> generatedMoviesList = new ArrayList<>();

        generatedMoviesList.add(generateMovie(" Dune: Part Two ",
                Genre.ACTION,
                13,
                Language.ENGLISH,
                dates,
                "/pictures/movie_logos/Dune2.jpg",
                7,
                "2:46"));
        generatedMoviesList.add(generateMovie("Anyone But You",
                Genre.ROMANCE,
                14,
                Language.ENGLISH,
                dates,
                "/pictures/movie_logos/AnyoneButYou.jpg",
                5,
                "1:43"));
        generatedMoviesList.add(generateMovie("Barbie",
                Genre.FANTASY,
                18,
                Language.SPANISH,
                dates,
                "/pictures/movie_logos/Barbie.jpg",
                3,
                "1:54"));
        generatedMoviesList.add(generateMovie("Barbie",
                Genre.FANTASY,
                18,
                Language.ENGLISH,
                dates,
                "/pictures/movie_logos/Barbie.jpg",
                3,
                "1:54"));
        generatedMoviesList.add(generateMovie("Bob Marley: One Love",
                Genre.DOCUMENTARY,
                13,
                Language.ENGLISH,
                dates,
                "/pictures/movie_logos/BobMarley.jpg",
                4,
                "1:47"));
        generatedMoviesList.add(generateMovie("Cat & Dog",
                Genre.ACTION,
                10,
                Language.ENGLISH,
                dates,
                "/pictures/movie_logos/CatNDog.jpg",
                8,
                "1:20"));
        generatedMoviesList.add(generateMovie("Ferrari",
                Genre.THRILLER,
                16,
                Language.ENGLISH,
                dates,
                "/pictures/movie_logos/Ferrari.jpg",
                6,
                "2:11"));
        generatedMoviesList.add(generateMovie("Kung Fu Panda 4",
                Genre.ACTION,
                5,
                Language.ENGLISH,
                dates,
                "/pictures/movie_logos/KungFuPanda4.jpg",
                10,
                "1:34"));

        for (Movie movie : generatedMoviesList) {
            addNonDuplicateMoviesToMoviesList(movie);
            ifNecessaryChangeDates(movie);
        }
    }

    private void ifNecessaryChangeDates(Movie movie) {
        for (int i = 0; i < movies.size(); i++) {
            if (Objects.equals(movies.get(i).name(), movie.name()) && movies.get(i).language().equals(movie.language())) {
                if (movies.get(i).dates() != movie.dates()) {
                    movies.set(i, movie);
                }
                return;
            }
        }
    }

    public Movie generateMovie(String name,
                               Genre genre,
                               int ageLimit,
                               Language language,
                               ArrayList<String> dates,
                               String imgLocation,
                               int sessionsPerDay,
                               String duration) {

        return new Movie(name,
                genre,
                ageLimit,
                language,
                dates,
                generateSessionsForDates(sessionsPerDay),
                imgLocation,
                duration);
    }

    public void addNonDuplicateMoviesToMoviesList(Movie movieForTesting) {
        if (!movieNames.contains(movieForTesting.name() + movieForTesting.language())) {
            movies.add(movieForTesting);
            movieNames.add(movieForTesting.name() + movieForTesting.language());
        }
    }

    public void generateDatesForSessions() {
        Calendar calendar = Calendar.getInstance();
        String time = LocalTime.now().format(DateTimeFormatter.ofPattern("HH.mm"));
        double currentTime = Double.parseDouble(time);
        double endTime = Double.parseDouble(END_TIME);
        int today = calendar.get(Calendar.DAY_OF_MONTH);
        int generatedDays = 7;
        int maxDaysInCurrentMonth = Calendar.getInstance().getActualMaximum(Calendar.DAY_OF_MONTH);

        if (!dates.isEmpty()) {
            if (currentTime >= endTime) {

                int endDate = today + generatedDays;
                endDate %= maxDaysInCurrentMonth;

                if (today == Integer.parseInt(dates.getFirst().split("\\.")[0])) {
                    dates.removeFirst();
                }
                if (dates.size() < generatedDays) {
                    generateAndAddDate(endDate, maxDaysInCurrentMonth, calendar, today);
                }
            }
        } else {
            if (currentTime >= endTime) {
                today += 1;
                today %= maxDaysInCurrentMonth;
            }
            for (int day = today; day < today + generatedDays; day++) {
                generateAndAddDate(day, maxDaysInCurrentMonth, calendar, today);
            }
        }
    }

    private void generateAndAddDate(int endDate, int maxDaysInCurrentMonth, Calendar calendar, int today) {
        if (endDate > maxDaysInCurrentMonth) {
            dates.add(getDateToAdd(endDate % maxDaysInCurrentMonth, calendar, today));
        } else {
            dates.add(getDateToAdd(endDate, calendar, today));
        }
    }

    private ArrayList<String> generateSessionsForDates(int sessionsPerDay) {
        ArrayList<Double> sessionsAsDouble = new ArrayList<>();
        ArrayList<String> sessions = new ArrayList<>();
        Random random = new Random();
        double endTime = Double.parseDouble(END_TIME);
        double startTime = Double.parseDouble(START_TIME);


        double totalHours = endTime - startTime;
        double timeBetweenTwoSessionStarts = (double) Math.round((totalHours / sessionsPerDay) * 100) / 100;
        double timeToNextSession = 0;


        for (int i = 0; i < sessionsPerDay; i++) {
            if (i == 0) {
                timeToNextSession = round(random.nextDouble(), 2);
            } else {
                timeToNextSession += round(timeBetweenTwoSessionStarts + random.nextDouble() * 2 - 1, 2);
            }

            sessionsAsDouble.add(Math.min(startTime + timeToNextSession, endTime));
        }


        for (double session : sessionsAsDouble) {
            sessions.add(getSessionString(session));
        }

        return sessions;
    }

    private static String getSessionString(double session) {
        String sessionStringToAdd = "";
        if (session < 10) {
            sessionStringToAdd += "0";
        }
        int minutes = (int) ((session - (int) session) * 60);
        sessionStringToAdd += (int) session + ".";

        if (minutes < 10) {
            sessionStringToAdd += "0" + minutes;
        } else {
            sessionStringToAdd += minutes;
        }
        return sessionStringToAdd;
    }


    private String getDateToAdd(int day, Calendar calendar, int today) {
        String formattedDay = day < 10 ? "0" + day : String.valueOf(day);
        int month = 0;
        if (day < today) {
            month = calendar.get(Calendar.MONTH) + 2;
        } else {
            month = calendar.get(Calendar.MONTH) + 1;
        }
        String monthToAdd = month < 10 ? "0" + month : String.valueOf(month);

        return formattedDay + "." + monthToAdd + "." + calendar.get(Calendar.YEAR);
    }

    public void generateRandomMovies(int generateAmountOfMovies, ArrayList<Movie> userMovies) {
        //Taken from https://www.baeldung.com/java-random-string
        int leftLimit = 97; // letter 'a'
        int rightLimit = 122; // letter 'z'
        int targetStringLength = 10;
        Random random = new Random();
        //Til here

        for (int j = 0; j < generateAmountOfMovies; j++) {
            //This is also from the previous link
            String generatedMovieString = random.ints(leftLimit, rightLimit + 1)
                    .limit(targetStringLength)
                    .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                    .toString();
            //Until here
            int ageLimit = random.nextInt(18);


            userMovies.add(generateMovie(generatedMovieString,
                    Genre.values()[random.nextInt(Genre.values().length)],
                    ageLimit,
                    Language.values()[random.nextInt(Language.values().length)],
                    new ArrayList<>(),
                    "",
                    0,
                    "00:00"));
        }
    }


    //Code taken from https://stackoverflow.com/questions/2808535/round-a-double-to-2-decimal-places
    //Code is copied only for its functionality in rounding up number
    public double round(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();

        BigDecimal bd = BigDecimal.valueOf(value);
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }
}
