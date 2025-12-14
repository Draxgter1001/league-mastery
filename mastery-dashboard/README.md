# LoL Mastery Dashboard - Backend

Spring Boot REST API for League of Legends Champion Mastery tracking.

## 🚀 Features

- Riot Games API integration
- PostgreSQL database with JPA/Hibernate
- Smart caching (5-minute database cache)
- RESTful endpoints with proper error handling
- CORS enabled for frontend integration
- Transaction management for data consistency

## 🛠️ Tech Stack

- **Java 17+**
- **Spring Boot 3.2+**
- **PostgreSQL**
- **Spring Data JPA / Hibernate**
- **Lombok**
- **WebFlux** (for reactive HTTP client)

## 📋 Prerequisites

- Java 17 or higher
- PostgreSQL 12 or higher
- Maven 3.6+
- Riot Games Developer API Key

## ⚙️ Setup

### 1. Clone the repository

\`\`\`bash
git clone <your-repo-url>
cd mastery-dashboard
\`\`\`

### 2. Configure Database

Create PostgreSQL database:

\`\`\`sql
CREATE DATABASE lol_mastery_db;
\`\`\`

### 3. Configure Environment Variables

Create \`.env\` file in project root:

\`\`\`properties

DATABASE_URL_LOCAL=jdbc:postgresql://localhost:5432/lol_mastery_db

DATABASE_USERNAME=postgres

DATABASE_PASSWORD=your_password

RIOT_API_KEY=RGAPI-your-api-key-here
\`\`\`

### 4. Run the Application

\`\`\`bash
./mvnw spring-boot:run
\`\`\`

Server will start on \`http://localhost:8080\`

## 📡 API Endpoints

### Get Summoner with Masteries

\`\`\`
GET /api/summoners/{gameName}/{tagLine}?region={region}
\`\`\`

**Parameters:**
- \`gameName\` - Summoner's game name
- \`tagLine\` - Summoner's tag line
- \`region\` - Server region (NA1, EUW1, KR, etc.)

**Example:**
\`\`\`bash
curl http://localhost:8080/api/summoners/Faker/KR1?region=kr
\`\`\`

**Response:**
\`\`\`json
{
"puuid": "...",
"gameName": "Faker",
"tagLine": "KR1",
"region": "KR",
"summonerLevel": 500,
"profileIconId": 4568,
"totalMasteryScore": 450,
"chestsAvailable": 25,
"championMasteries": [...]
}
\`\`\`

## 🗄️ Database Schema

### Summoners Table
- \`puuid\` (PK) - Riot universal unique ID
- \`game_name\` - Summoner name
- \`tag_line\` - Summoner tag
- \`region\` - Server region
- \`profile_icon_id\` - Profile icon ID
- \`summoner_level\` - Account level
- \`last_updated\` - Last data fetch timestamp

### Champion Masteries Table
- \`id\` (PK) - Auto-increment ID
- \`puuid\` (FK) - Reference to summoner
- \`champion_id\` - Champion numeric ID
- \`champion_level\` - Mastery level (1-7+)
- \`champion_points\` - Total mastery points
- \`chest_granted\` - Chest availability
- \`tokens_earned\` - Mastery tokens (for levels 6-7)

## 🔧 Configuration

Key settings in \`application.yml\`:

- **Caching:** 5-minute database cache before API call
- **Hibernate:** \`ddl-auto: update\` (auto-creates tables)
- **CORS:** Enabled for \`http://localhost:5173\`

## 🚦 Development

### Run Tests
\`\`\`bash
./mvnw test
\`\`\`

### Build
\`\`\`bash
./mvnw clean package
\`\`\`

### Code Style
- Follow Spring Boot conventions
- Use Lombok for boilerplate reduction
- DTOs for API responses
- Service layer for business logic

## 👤 Author

Tafshi Uthshow Hoque - [GitHub](https://github.com/Draxgter1001)