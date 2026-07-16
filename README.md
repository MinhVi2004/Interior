
# Interior

Interior is an e-commerce platform with a Spring Boot backend and a React frontend. The backend uses JWT authentication, MySQL at runtime, H2 for tests, Cloudinary for media when configured, and local file fallback for uploads when Cloudinary is not configured.

## Project Structure

```text
Interior/
├── backend/
│   └── interior/           # Spring Boot API
├── front/                   # React + Vite frontend
└── README.md
```

## Backend

The backend endpoints are documented in [backend/interior/API_GUIDE.md](backend/interior/API_GUIDE.md).

### Key Features

- JWT Bearer authentication
- Role-based access control for `ADMIN` and `STAFF`
- User signup, signin, social signin placeholders, password reset, and email verification
- Product, category, banner, cart, address, and order management
- Variant and variant size management
- VNPay order flow placeholder endpoints
- Cloudinary upload support with local file fallback

### Run Backend

```bash
cd backend/interior
./mvnw spring-boot:run
```

On Windows:

```powershell
cd backend/interior
.\mvnw spring-boot:run
```

### Test Backend

```bash
cd backend/interior
./mvnw test
```

### Runtime Configuration

The backend runtime config is in [backend/interior/src/main/resources/application.properties](backend/interior/src/main/resources/application.properties).

Important values:

- `spring.datasource.url`
- `spring.datasource.username`
- `spring.datasource.password`
- `jwt.secret`
- `jwt.expiration`
- `cloudinary.cloud-name`
- `cloudinary.api-key`
- `cloudinary.api-secret`
- `spring.mail.username`
- `spring.mail.password`

## Frontend

The frontend is in `front/` and uses Vite. Point its API client to the backend base URL.

## API Reference

See [backend/interior/API_GUIDE.md](backend/interior/API_GUIDE.md) for the implemented endpoints, auth rules, and request payloads.

## Notes

- Uploaded files fall back to the local `uploads/` directory when Cloudinary is not configured.
- Test context uses H2 and test-only credentials so the app can start without external services.
