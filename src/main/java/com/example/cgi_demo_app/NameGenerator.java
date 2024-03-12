package com.example.cgi_demo_app;

import java.io.BufferedReader;
import java.io.Console;
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
                if(line.equals("$name")){
                    nameListSelector = 0;
                    continue;
                } else if (line.equals("$namef")){
                    nameListSelector = 1;
                    continue;
                } else if (line.equals("$surname")){
                    nameListSelector = 2;
                    continue;
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
        } else if(selectMaleOrFemaleNames == 1){
            generatedName += femaleNames.get(random.nextInt(femaleNames.size()));
        }
        generatedName += " ";
        generatedName += surNames.get(random.nextInt(surNames.size()));

        return generatedName;
    }


}
