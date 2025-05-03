package com.accounts;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.usedQuotes.UsedQuote;
import com.usedQuotes.UsedQuoteService;
import jakarta.json.JsonObject;
import org.bson.Document;

import java.util.ArrayList;
import java.util.List;

public class MyCollectionService {

    static UsedQuoteService usedQuoteService;

    public MyCollectionService(UsedQuoteService usedService) {
        usedQuoteService = usedService;
    }

    static void sort_Used_Oldest(List<JsonObject> usedQuotes, Account acc, int lower, int upper) {
        if(upper <= lower) return;

        int pivot = partition(usedQuotes, acc, lower, upper);
        sort_Used_Oldest(usedQuotes, acc, lower, pivot - 1);
        sort_Used_Oldest(usedQuotes, acc, pivot + 1, upper);
    }

    static int partition(List<JsonObject> usedQuotes, Account acc, int lower, int upper) {
        try {
            JsonObject pivotObject = usedQuotes.get(upper);
            long pivotTime = pivotObject.getInt("date");

            int i = lower - 1;
            ObjectMapper mapper = new ObjectMapper();

            for(int j = lower; j <= upper - 1; j++) {
                //get used quote object
                Document usedQuoteDoc = usedQuoteService.retrieveUsedQuote(acc.UsedQuotes.get(usedQuotes.get(j).getString("_id")));
                UsedQuote usedQuoteObject = mapper.readValue(usedQuoteDoc.toJson(), UsedQuote.class);
                if(usedQuoteObject.getUsed().getTime() < pivotTime) {
                    i++;
                    JsonObject temp = usedQuotes.get(i);
                    usedQuotes.set(i, usedQuotes.get(j));
                    usedQuotes.set(j, temp);
                }
            }
            i++;
            JsonObject temp = usedQuotes.get(i + 1);
            usedQuotes.set(i + 1, usedQuotes.get(upper));
            usedQuotes.set(upper, temp);
            return i + 1;
        } catch (JsonProcessingException e) {
            System.out.print("Error in partition step: "+e);
            return -1;
        }
    }

    List<String> intersection(List<String> list1, List<String> list2) {
        try {
            List<String> result = new ArrayList<String>(list1);
            result.retainAll(list2);
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

}
