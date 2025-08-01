# SecureBank - Secure Banking Registration & Login API

A comprehensive banking application built with Spring Boot, featuring secure user registration and authentication with JWT tokens, BCrypt password encryption, and modern web interface.

## 🏦 Features

- **Secure Authentication**: JWT-based authentication with BCrypt password hashing
- **User Registration**: Complete user registration with validation
- **Modern UI**: Responsive web interface with Bootstrap 5 and custom CSS
- **API Documentation**: Swagger UI for easy API testing
- **Input Validation**: Server-side and client-side validation
- **Real-time Feedback**: Form validation with visual feedback
- **Role-based Access**: User role management system
- **Database Integration**: MySQL database with JPA/Hibernate

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.2.0** - Application framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database access layer
- **MySQL** - Primary database
- **JWT (JSON Web Tokens)** - Stateless authentication
- **BCrypt** - Password encryption
- **Swagger/OpenAPI 3** - API documentation
- **Maven** - Dependency management

### Frontend
- **HTML5/CSS3** - Structure and styling
- **JavaScript (ES6+)** - Client-side logic
- **Bootstrap 5** - UI framework
- **Font Awesome** - Icons

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd secure-bank-api
   ```

2. **Configure Database**
   
   Create MySQL database:
   ```sql
   CREATE DATABASE secure_bank_db;
   ```
   
   Update `src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/secure_bank_db?createDatabaseIfNotExist=true
       username: your_mysql_username
       password: your_mysql_password
   ```

3. **Install Dependencies**
   ```bash
   mvn clean install
   ```

4. **Run the Application**
   ```bash
   mvn spring-boot:run
   ```

5. **Access the Application**
   - **Web Interface**: http://localhost:8080/api
   - **Swagger UI**: http://localhost:8080/api/swagger-ui.html
   - **API Docs**: http://localhost:8080/api/api-docs

## 📚 API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "mobile": "9876543210",
  "pan": "ABCDE1234F",
  "password": "securepassword123",
  "entityType": "individual",
  "pincode": "400001",
  "branch": "mumbai-central"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

#### Check Email Availability
```http
GET /api/auth/check-email/{email}
```

#### Check Mobile Availability
```http
GET /api/auth/check-mobile/{mobile}
```

#### Check PAN Availability
```http
GET /api/auth/check-pan/{pan}
```

### Response Examples

#### Successful Registration
```json
{
  "message": "User registered successfully! Welcome to SecureBank, John!"
}
```

#### Successful Login
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "id": 1,
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER"
}
```

#### Validation Error
```json
{
  "email": "Email should be valid",
  "mobile": "Mobile number should be 10 digits starting with 6-9"
}
```

## 🔒 Security Features

- **JWT Authentication**: Stateless authentication using JSON Web Tokens
- **BCrypt Password Hashing**: Industry-standard password encryption
- **Input Validation**: Comprehensive server-side and client-side validation
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Security Headers**: Protection against common web vulnerabilities

## 📝 Validation Rules

### User Registration
- **First Name**: 2-50 characters, required
- **Last Name**: 2-50 characters, required
- **Email**: Valid email format, unique, required
- **Mobile**: 10 digits starting with 6-9, unique, required
- **PAN**: Format ABCDE1234F, unique, required
- **Password**: Minimum 8 characters, required
- **Entity Type**: Required selection from predefined options
- **Pincode**: 6 digits (optional)
- **Branch**: Optional selection

## 🎨 UI Features

- **Modern Design**: Beautiful gradient backgrounds and animations
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Real-time Validation**: Instant feedback on form inputs
- **Loading States**: Visual feedback during API calls
- **Alert System**: Success, error, and info notifications
- **Form Switching**: Smooth transitions between registration and login

## 🗂️ Project Structure

```
src/
├── main/
│   ├── java/com/bankapp/
│   │   ├── config/          # Configuration classes
│   │   ├── controller/      # REST controllers
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entity/         # JPA entities
│   │   ├── exception/      # Exception handling
│   │   ├── repository/     # Data repositories
│   │   ├── security/       # Security configuration
│   │   └── service/        # Business logic
│   └── resources/
│       ├── static/         # Web assets (HTML, CSS, JS)
│       └── application.yml # Configuration
└── test/                   # Unit and integration tests
```

## 🧪 Testing

### Using Swagger UI
1. Navigate to http://localhost:8080/api/swagger-ui.html
2. Test the registration endpoint with sample data
3. Use the returned JWT token for authenticated requests

### Using Postman
1. Import the API collection (available in `/docs` folder)
2. Set environment variables for base URL
3. Test all endpoints with various scenarios

### Sample Test Data
```json
{
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice.johnson@example.com",
  "mobile": "9876543210",
  "pan": "ABCDE1234F",
  "password": "mypassword123",
  "entityType": "individual",
  "pincode": "400001",
  "branch": "mumbai-central"
}
```

## 🔧 Configuration

### JWT Configuration
```yaml
jwt:
  secret: your-secret-key-here
  expiration: 86400000 # 24 hours
```

### Database Configuration
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

## 🌟 Key Features Highlights

1. **Complete Authentication Flow**: Registration → Email verification → Login → JWT token
2. **Enhanced Security**: BCrypt hashing, JWT tokens, input validation
3. **Modern UI/UX**: Responsive design with smooth animations
4. **API Documentation**: Comprehensive Swagger documentation
5. **Error Handling**: Global exception handling with meaningful messages
6. **Real-time Validation**: Client-side validation with visual feedback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@securebank.com or create an issue in the repository.

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---

**SecureBank** - Building the future of secure banking technology 🏦✨