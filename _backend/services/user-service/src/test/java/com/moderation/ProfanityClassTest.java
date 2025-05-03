package com.moderation;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ProfanityClassTest {

    ProfanityClass profanityClass = new ProfanityClass();

    @Test
    void checkProfanityTC1() {
        boolean isProfanity = profanityClass.checkProfanity("hello");
        assertFalse(isProfanity);
    }

    @Test
    void checkProfanityTC2() {
        boolean isProfanity = profanityClass.checkProfanity("");
        assertFalse(isProfanity);
    }

    @Test
    void checkProfanityTC3() {
        boolean isProfanity = profanityClass.checkProfanity(null);
        assertFalse(isProfanity);
    }

    @Test
    void checkProfanityTC4() {
        boolean isProfanity = profanityClass.checkProfanity("573");
        assertFalse(isProfanity);
    }

    @Test
    void checkProfanityTC6() {
        boolean isProfanity = profanityClass.checkProfanity("damn");
        assertTrue(isProfanity);
    }

    @Test
    void checkProfanityTC7() {
        boolean isProfanity = profanityClass.checkProfanity("dumbass");
        assertTrue(isProfanity);
    }
}