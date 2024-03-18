package com.example.cgi_demo_app.generators;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Random;

public class NameGenerator {
    ArrayList<String> maleNames = new ArrayList<>();
    ArrayList<String> femaleNames = new ArrayList<>();
    ArrayList<String> surNames = new ArrayList<>();

    public String generateName(String filename) throws IOException {
        String generatedName = "";
        if( maleNames.isEmpty() && femaleNames.isEmpty() && surNames.isEmpty()){
            BufferedReader bf=new BufferedReader (new FileReader(filename));
            String line = "";
            int nameListSelector = 0;
            while(line != null){
                line = bf.readLine();
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
            bf.close();
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
