FROM openjdk:21-slim AS builder

# Copy the project directory from the host machine, including gradlew
WORKDIR /app

COPY . .

RUN chmod +x gradlew

# Install dependencies using Gradle
RUN ./gradlew clean build test

# Create a new image for the application server
FROM openjdk:21-slim

# Copy the compiled application files from the builder stage
WORKDIR /app

WORKDIR /app/resources/static

COPY --from=builder /app/build/libs/*.jar app.jar

# Expose the port where your Spring Boot application listens (default is 8080)
EXPOSE 8080

# Start the application using the JAR file
CMD ["java", "-jar", "app.jar"]