package com.example.cgi_demo_app;

import com.example.cgi_demo_app.endpoints.UsersEndpoint;
import com.example.cgi_demo_app.generators.UserGenerator;
import com.example.cgi_demo_app.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@SpringBootTest
public class UsersTests {
    @Mock
    private UserGenerator userGenerator;

    @InjectMocks
    private UsersEndpoint usersEndpoint;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
    }

    List<User> mockUsers = new ArrayList<>();

    @Test
    void testCreateUserGeneratesUser(){
        User user = User.createUser("Test", "User", UUID.randomUUID(), new ArrayList<>());

        assertEquals(User.class, user.getClass());
    }

    @Test
    void testGetUsersEndpoint() throws IOException {
        User user1 = new User(UUID.randomUUID(), "Test", "User", new ArrayList<>());
        User user2 = new User(UUID.randomUUID(), "Test", "User2", new ArrayList<>());
        User user3 = new User(UUID.randomUUID(), "Test", "User3", new ArrayList<>());
        User user4 = new User(UUID.randomUUID(), "Test", "User4", new ArrayList<>());
        mockUsers.add(user1);
        mockUsers.add(user2);
        mockUsers.add(user3);
        mockUsers.add(user4);

        when(userGenerator.getUsers()).thenReturn((ArrayList<User>) mockUsers);

        List<User> usersFromEndpoint = usersEndpoint.getUsers();

        assertEquals(mockUsers, usersFromEndpoint);
    }

    @Test
    void testGetUsersGenerator() throws IOException {
        UserGenerator realUserGenerator = new UserGenerator();
        List<User> realUsers = realUserGenerator.getUsers();
        int userAmount = 10;

        assertEquals(userAmount, realUsers.size());
    }



}
