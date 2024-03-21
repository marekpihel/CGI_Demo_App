package com.example.cgi_demo_app.generators;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Random;
import java.util.Scanner;

public class NameGenerator {
    ArrayList<String> maleNames = new ArrayList<>();
    ArrayList<String> femaleNames = new ArrayList<>();
    ArrayList<String> surNames = new ArrayList<>();

    public String generateName() throws IOException {
        String generatedName = "";
        if( maleNames.isEmpty() && femaleNames.isEmpty() && surNames.isEmpty()){
            InputStream inputStream = getClass().getClassLoader().getResourceAsStream("static/Names.txt");
            Scanner scanner = new Scanner(inputStream);
            String line = "";
            int nameListSelector = 0;
            while(scanner.hasNextLine()){
                line = scanner.nextLine();
                if(line==null) break;
                switch (line) {
                    case "$name" -> {
                        nameListSelector = 0;
                        continue;
                    }
                    case "$namef" -> {
                        nameListSelector = 1;
                        continue;
                    }
                    case "$surname" -> {
                        nameListSelector = 2;
                        continue;
                    }
                }

                if(nameListSelector == 0){
                    maleNames.add(line);
                } else if (nameListSelector == 1){
                    femaleNames.add(line);
                } else {
                    surNames.add(line);
                }
            }
            inputStream.close();
        }

        Random random = new Random();
        int selectMaleOrFemaleNames = random.nextInt(2);


        if(selectMaleOrFemaleNames == 0){
            generatedName += maleNames.get(random.nextInt(maleNames.size()));
        } else {
            generatedName += femaleNames.get(random.nextInt(femaleNames.size()));
        }
        generatedName += " ";
        generatedName += surNames.get(random.nextInt(surNames.size()));

        return generatedName;
    }


}
