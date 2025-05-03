package com.accounts;

import static org.junit.jupiter.api.Assertions.*;

import com.auth.SessionService;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.sharedQuotes.SharedQuote;
import com.usedQuotes.UsedQuoteService;
import jakarta.json.JsonObject;
import org.junit.jupiter.api.*;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Testcontainers
class MyCollectionServiceTest {

    public static MyCollectionService myCollectionService;

    @Container
    private static final MongoDBContainer mongoDBContainer =
            new MongoDBContainer("mongo:6.0");

    // Setup Method
    @BeforeAll
    public static void setUp() {
//        Dotenv dotenv = Dotenv.configure()
//                .load();

//        MongoClient client = MongoClients.create(dotenv.get("CONNECTION_STRING"));

//        String connectionString = System.getenv("CONNECTION_STRING");

        String connectionString = mongoDBContainer.getConnectionString();
        MongoClient client = MongoClients.create(connectionString);

        UsedQuoteService usedQuoteService = new UsedQuoteService(connectionString, "Test", "UsedQuotes");
        myCollectionService = new MyCollectionService(usedQuoteService);

    }

    // Intersection of 2 lists
    // returns list of string of matching tags
    @Test
    void intersectionTC1() {
        List<String> list1 = List.of("Funny", "Life");
        List<String> list2 = List.of("Funny", "Inspirational");
        List<String> result = myCollectionService.intersection(list1, list2);

        List<String> expected = List.of("Funny");

        assertEquals(expected, result);
    }

    @Test
    void intersectionTC2() {
        List<String> list1 = List.of("Funny", "Life", "Inspirational");
        List<String> list2 = List.of("Funny", "Inspirational", "Wisdom");
        List<String> result = myCollectionService.intersection(list1, list2);

        List<String> expected = List.of("Funny", "Inspirational");

        assertEquals(expected, result);
    }

    @Test
    void intersectionTC3() {
        List<String> list1 = List.of("Wisdom", "Life", "Inspirational");
        List<String> list2 = List.of("Funny", "Inspirational", "Wisdom");
        List<String> result = myCollectionService.intersection(list1, list2);

        List<String> expected = List.of("Wisdom", "Inspirational");

        assertEquals(expected, result);
    }

    @Test
    void intersectionTC4() {
        List<String> list1 = List.of("Life");
        List<String> list2 = List.of("Funny", "Inspirational", "Wisdom");
        List<String> result = myCollectionService.intersection(list1, list2);

        List<String> expected = List.of();

        assertEquals(expected, result);
    }

    @Test
    void intersectionTC5() {
        List<String> list1 = null;
        List<String> list2 = List.of("Funny", "Inspirational", "Wisdom");
        List<String> result = myCollectionService.intersection(list1, list2);

        List<String> expected = new ArrayList<>();

        assertEquals(expected, result);
    }

    @Test
    void intersectionTC6() {
        List<String> list1 = List.of("Life");
        List<String> list2 = null;
        List<String> result = myCollectionService.intersection(list1, list2);

        List<String> expected = new ArrayList<>();

        assertEquals(expected, result);
    }

    @Test
    void intersectionTC7() {
        List<String> list1 = new ArrayList<>();
        List<String> list2 = List.of("Funny", "Inspirational", "Wisdom");
        List<String> result = myCollectionService.intersection(list1, list2);

        List<String> expected = List.of();

        assertEquals(expected, result);
    }

    @Test
    void intersectionTC8() {
        List<String> list1 = new ArrayList<>();
        List<String> list2 = List.of("Funny", "Inspirational", "Wisdom");
        List<String> result = myCollectionService.intersection(list1, list2);

        List<String> expected = List.of();

        assertEquals(expected, result);
    }

    @Test
    void intersectionTC9() {
        List<String> list1 = List.of("Life");
        List<String> list2 = new ArrayList<>();
        List<String> result = myCollectionService.intersection(list1, list2);

        List<String> expected = List.of();

        assertEquals(expected, result);
    }

    @Test
    void intersectionTC10() {
        List<String> list1 = new ArrayList<>();
        List<String> list2 = new ArrayList<>();
        List<String> result = myCollectionService.intersection(list1, list2);

        List<String> expected = new ArrayList<>();

        assertEquals(expected, result);
    }

    @Test
    void intersectionTC11() {
        List<String> list1 = List.of("Funny", "Life", "Inspirational");
        List<String> list2 = List.of("Funny", "Life", "Inspirational");
        List<String> result = myCollectionService.intersection(list1, list2);

        List<String> expected = List.of("Funny", "Life", "Inspirational");

        assertEquals(expected, result);
    }

}