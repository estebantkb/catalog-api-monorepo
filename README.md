## Project Description

Responsive web application with two catalog views: a hardware product catalog
with immediate search and a dynamic Rick and Morty explorer that combines
multiple API endpoints. The application is developed locally with a Spring
Boot backend, PostgreSQL, and a frontend based on Tailwind CSS and JavaScript.

## 1. Technologies Used
- **Frontend:** HTML5, Tailwind CSS (CDN), Vanilla JavaScript (ECMAScript ES6+), Arrow Functions (`=>`), Functional Paradigm (`.map`, `.filter`, `.some`), jQuery, and native `fetch` API.
- **Backend:** Java 21, Spring Boot (MVC Pattern), and Lombok (`@Data`, `@AllArgsConstructor`).
- **Database:** PostgreSQL.
- **Containers & DevOps:** Podman, Podman Compose, OCI images, GitHub Actions (CI/CD), and Docker Hub as the image registry.
- **Project Management:** Jira Scrum.

Podman is the local container engine. Docker Hub is used only as a remote
registry for storing and distributing OCI-compatible images; Docker Engine is
not required for local development. The CI/CD workflows will build, tag, and
push images using a Podman-compatible process.

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
