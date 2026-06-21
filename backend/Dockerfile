FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw && ./mvnw clean package -DskipTestsgit add backend/Dockerfile

CMD ["java","-jar","target/*.jar"]