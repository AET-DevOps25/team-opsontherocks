FROM gradle:8.8-jdk17 AS build

#Working Directory: Sets the working directory inside the container to /app.
WORKDIR /app

#Copy Build Scripts: Copies the build.gradle and settings.gradle files from the host #machine to the container.
COPY build.gradle .
COPY settings.gradle .

#Copy Source Code: Copies the source code from the host machine to the #container's /app/src directory.
COPY src ./src

#Build Application: Runs the gradle bootJar command to build the Spring Boot #application and generate a JAR file. This command compiles the code and #packages it into a JAR file located in the build/libs directory.
RUN gradle bootJar

#Base Image: Uses the official OpenJDK 17 image for the runtime environment.
#Alias: Names this stage runtime.
FROM openjdk:17 AS runtime

#Working Directory: Sets the working directory inside the container to /app.
WORKDIR /app

#Copy Artifact: Copies the JAR file generated in the build stage from /app/build/libs #to the runtime stage's /app directory and renames it to app.jar.
COPY --from=build /app/build/libs/*.jar /app/app.jar


#Entry Point: Defines the command to run when the container starts. It runs the #Java application using the JAR file.
ENTRYPOINT ["java", "-jar", "/app/app.jar"]