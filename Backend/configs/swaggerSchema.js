const swaggerSchemas = {
  User: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      _id: {
        type: "string",
        description: "Unique identifier for the user",
        example: "64f8a1b2c3d4e5f6789012ab"
      },
      name: {
        type: "string",
        description: "User's full name",
        example: "John Doe"
      },
      email: {
        type: "string",
        format: "email",
        description: "User's email address",
        example: "john.doe@example.com"
      },
      password: {
        type: "string",
        description: "User's password (hashed)",
        writeOnly: true
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "Account creation timestamp",
        example: "2024-01-15T10:30:00.000Z"
      }
    }
  },
};

module.exports = swaggerSchemas;