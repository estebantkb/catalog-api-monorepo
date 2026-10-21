## 1. Technologies Used
- **Frontend:** HTML5, Tailwind CSS (CDN), Vanilla JavaScript (ECMAScript ES6+), Arrow Functions (`=>`), Functional Paradigm (`.map`, `.filter`, `.some`), jQuery, and native `fetch` API.
- **Backend:** Java 17, Spring Boot (MVC Pattern), and Lombok (`@Data`, `@AllArgsConstructor`).
- **DevOps & Project Management:** Jira Scrum, GitHub Actions (CI/CD), Docker, and Docker Compose.

## 2. System Architecture & Nested Endpoints Diagram
```mermaid
graph LR
    subgraph Client [Frontend - Browser]
        V1[View 1: Local / MVC Catalog]
        V2[View 2: API Explorer + 4s Debounce]
    end

    subgraph CustomBackend [Backend - Spring Boot MVC]
        C[ArticleController] --> M[Article Model + Lombok]
    end

    subgraph ExternalAPI [Rick & Morty REST API]
        E1[1. /api/character] --> E2[2. /api/episode/id]
        E1 --> E3[3. /api/location/id]
    end

    V1 -- "GET /api/articles" --> C
    V2 -- "Dynamic Nested Fetch" --> E1
