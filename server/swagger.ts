import swaggerJSDoc from "swagger-jsdoc";
const options: swaggerJSDoc.Options = {
  definition: {
    "openapi": "3.0.0",
    "info": {
      "title": "MindSync API",
      "version": "1.0.0",
      "description": "תיעוד של כל ה-API בצד שרת של MindSync"
    },
    "servers": [
      {
        "url": "https://localhost:4000"
      }
    ],

    "components": {
      "securitySchemes": {
        "bearerAuth": {
          "type": "http",
          "scheme": "bearer",
          "bearerFormat": "JWT"
        }
      }
    },

    "paths": {
      "/user/upsert": {
        "post": {
          "summary": "upsert user",
          "tags": ["Users"],
          "requestBody": {
            "description": "user details to upsert",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "uid": { "type": "string" },
                    "email": { "type": "string" },
                    "full_name": { "type": "string" },
                    "photo_url": { "type": "string" },
                    "phone": { "type": "string" }
                  },
                  "required": ["uid", "email", "full_name", "photo_url", "phone"]
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "User upserted successfully"
            }
          }
        }
      },

      "/user/getUser/{uid}": {
        "get": {
          "summary": "get user profile by uid",
          "tags": ["Users"],
          "security": [
            { "bearerAuth": [] }
          ],
          "parameters": [
            {
              "name": "uid",
              "in": "path",
              "required": true,
              "schema": { "type": "string" }
            }
          ],
          "responses": {
            "200": { "description": "User details retrieved successfully" },
            "404": { "description": "User not found" }

          }
        }
      },

      "/user/change-role": {
        "put": {
          "summary": "change user role",
          "tags": ["Users"],
          "security": [
            { "bearerAuth": [] }
          ],
          "requestBody": {
            "description": "user details to upsert",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "targetUid": { "type": "string" },
                    "newRole": { "type": "string" },
                  },
                  "required": ["targetUid", "newRole"]
                }
              }
            }
          },
          "responses": {
            "200": { "description": "User role changed successfully" },
            "404": { "description": "User not found" }

          }
        }
      },

      "/sessions/createSession": {
        "post": {
          "summary": "create session",
          "tags": ["sessions"],
          "security": [
            { "bearerAuth": [] }
          ],
          "requestBody": {
            "description": "session details to create",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "title": { "type": "string" },
                    "description": { "type": "string" },
                    "password": { "type": "string" },
                  },
                  "required": ["title", "description", "password"]
                }
              }
            }
          },
          "responses": {
            "200": { "description": "Session created successfully" },
            "404": { "description": "Session not found" }

          }
        }
      },

      "/sessions/{id}/join": {
        "post": {
          "summary": "join session",
          "tags": ["sessions"],
          "security": [
            { "bearerAuth": [] }
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": { "type": "string" }
            }
          ],
          "requestBody": {
            "description": "session details to create",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "password": { "type": "string" },
                  },
                  "required": ["password"]
                }
              }
            }
          },
          "responses": {
            "200": { "description": "Session joined successfully" },
            "404": { "description": "Session or user not found" }

          }
        }
      },

      "/ideas/create": {
        "post": {
          "summary": "create session",
          "tags": ["ideas"],
          "security": [
            { "bearerAuth": [] }
          ],
          "requestBody": {
            "description": "session details to create",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "sessionId": { "type": "number" },
                    "text": { "type": "string" },
                  },
                  "required": ["sessionId", "text"]
                }
              }
            }
          },
          "responses": {
            "200": { "description": "Idea created successfully" },
            "404": { "description": "Idea or session not found" }

          }
        }
      },

      "/ai/process": {
        "post": {
          "summary": "process AI request",
          "tags": ["AI"],
          "security": [
            { "bearerAuth": [] }
          ],
          "requestBody": {
            "description": "AI request details",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "sessionId": { "type": "number" },
                    "mode": { "type": "string" },
                  },
                  "required": ["sessionId", "mode"]
                }
              }
            }
          },
          "responses": {
            "200": { "description": "AI request processed successfully" },
            "404": { "description": "Session not found" }

          }
        }
      },

      "/auth/mfa-protected": {
        "get": {
          "summary": "MFA protected route",
          "tags": ["auth"],
          "security": [
            { "bearerAuth": [] }
          ],
          "responses": {
            "200": { "description": "MFA verification successful" },
            "404": { "description": "MFA verification failed" }
          }
        }
      },

      "/auth/verify-token": {
        "get": {
          "summary": "verify token",
          "tags": ["auth"],
          "security": [
            { "bearerAuth": [] }
          ],
          "responses": {
            "200": {
              "description": "Token verified successfully"
            }
          }
        }
      },

      "/auth/verify-Email": {
        "get": {
          "summary": "verify email",
          "tags": ["auth"],
          "security": [
            { "bearerAuth": [] }
          ],
          "responses": {
            "200": {
              "description": "Email verified successfully"
            }
          }
        }
      },
      "/auth/verify-email-status/{uid}": {
        "get": {
          "summary": "verify email",
          "tags": ["auth"],
          "security": [
            { "bearerAuth": [] }
          ],
          "parameters": [
            {
              "name": "uid",
              "in": "path",
              "required": true,
              "schema": { "type": "string" }
            }
          ],
          "responses": {
            "200": {
              "description": "Email verification status retrieved successfully"
            },
          }
        }
      },
      "/ideaResponse/create": {
        "post": {
          "summary": "Create idea response (text OR emoji)",
          "tags": ["Responses"],
          "security": [{ "bearerAuth": [] }],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "idea_id": { "type": "integer" },
                    "emoji": { "type": "string" },
                    "text": { "type": "string" }
                  },
                  "oneOf": [
                    { "required": ["idea_id", "user_id", "emoji"] },
                    { "required": ["idea_id", "user_id", "text"] }
                  ]
                }
              }
            }
          },
          "responses": {
            "201": { "description": "Response created successfully" }
          }
        }
      },
      "/ideaResponse/update/{id}": {
        "put": {
          "summary": "Update idea response (text OR emoji)",
          "tags": ["Responses"],
          "security": [{ "bearerAuth": [] }],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": { "type": "number" }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "idea_id": { "type": "integer" },
                    "user_id": { "type": "string", "format": "uuid" },
                    "emoji": { "type": "string" },
                    "text": { "type": "string" }
                  },
                  "oneOf": [
                    { "required": ["idea_id", "user_id", "emoji"] },
                    { "required": ["idea_id", "user_id", "text"] }
                  ]
                }
              }
            }
          },
          "responses": {
            "201": { "description": "Response updated successfully" }
          }
        }
      },
      "/ideaResponse/delete/{id}": {
        "delete": {
          "summary": "Delete idea response (text OR emoji)",
          "tags": ["Responses"],
          "security": [{ "bearerAuth": [] }],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": { "type": "number" }
            }
          ],
          "responses": {
            "204": { "description": "Response deleted successfully" }
          }
        }
      },
      "/ideas/update/{id}": {
        "put": {
          "summary": "Update idea (text)",
          "tags": ["ideas"],
          "security": [{ "bearerAuth": [] }],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": { "type": "number" }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "sessionId": { "type": "number" },
                    "text": { "type": "string" }
                  },
                  "oneOf": [
                    { "required": ["sessionId", "text"] }
                  ]
                }
              }
            }
          },
          "responses": {
            "201": { "description": "Idea updated successfully" }
          }
        }
      },
      "/ideas/delete/{id}": {
        "delete": {
          "summary": "Delete idea",
          "tags": ["ideas"],
          "security": [{ "bearerAuth": [] }],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": { "type": "number" }
            }
          ],
          "responses": {
            "204": { "description": "Idea deleted successfully" }
          }
        }
      },
      "/sessions/get/{identifier}": {
        "post": {
          "summary": "Get session by ID or title",
          "tags": ["sessions"],
          "security": [
            { "bearerAuth": [] }
          ],
          "requestBody": {
            "description": "session access details",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "password": { "type": "string" },
                  },
                  "required": ["password"]
                }
              }
            }
          },
          "parameters": [
            {
              "name": "identifier",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Session ID (number) or session title (string)"
            }
          ],
          "responses": {
            "200": {
              "description": "Session found",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "id": { "type": "number" },
                      "title": { "type": "string" },
                      "description": { "type": "string" },
                      "password": { "type": "string" },
                      "created_at": { "type": "string", "format": "date-time" }
                    }
                  }
                }
              }
            },
            "404": {
              "description": "Session not found"
            }
          }
        }
      },
      "/ideas/by-session/{sessionId}": {
        "get": {
          "summary": "Get all ideas for a session",
          "tags": ["ideas"],
          "security": [{ "bearerAuth": [] }],
          "parameters": [
            {
              "name": "sessionId",
              "in": "path",
              "required": true,
              "schema": { "type": "number" }
            }
          ],
          "responses": {
            "200": {
              "description": "Ideas fetched successfully"
            },
            "404": {
              "description": "Session not found"
            }
          }
        }
      },
      "/sessions/getAllSessions": {
        "get": {
          "summary": "Get all sessions",
          "tags": ["sessions"],
          "security": [{ "bearerAuth": [] }],
          "responses": {
            "200": {
              "description": "Sessions retrieved successfully"
            },
            "500": {
              "description": "Unexpected error"
            }
          }
        }
      },
      "/sessions/user": {
        "get": {
          "summary": "Get sessions for the authenticated user",
          "tags": ["sessions"],
          "security": [{ "bearerAuth": [] }],
          "responses": {
            "200": {
              "description": "Sessions retrieved successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "id": { "type": "number" },
                        "title": { "type": "string" },
                        "description": { "type": "string" },
                        "created_at": { "type": "string", "format": "date-time" }
                      }
                    }
                  }
                }
              }
            },
            "401": { "description": "Unauthorized – Missing or invalid token" },
            "404": { "description": "No sessions found" }
          }
        }
      },
      "/ideaResponse/by-idea/{id}": {
        "get": {
          "summary": "Get all responses for a specific idea",
          "tags": ["Responses"],
          "security": [{ "bearerAuth": [] }],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": { "type": "number" }
            }
          ],
          "responses": {
            "200": {
              "description": "List of responses for the idea",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "id": { "type": "number" },
                        "idea_id": { "type": "number" },
                        "user_id": { "type": "string" },
                        "text": { "type": "string" },
                        "emoji": { "type": "string" },
                        "created_at": { "type": "string", "format": "date-time" }
                      }
                    }
                  }
                }
              }
            },
            "404": { "description": "No responses found" }
          }
        }
      }
      , "/sessions/delete/{id}": {
        "delete": {
          "summary": "Delete session (owner only)",
          "tags": ["sessions"],
          "security": [
            { "bearerAuth": [] }
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": { "type": "integer" },
              "description": "Session ID to delete"
            }
          ],
          "responses": {
            "204": { "description": "Session deleted successfully" },
            "400": { "description": "Invalid session ID" },
            "401": { "description": "Unauthorized" },
            "403": { "description": "Forbidden - Only session owner can delete" },
            "404": { "description": "Session not found" }
          }
        }
      },
      "/user/delete/{id}": {
        "delete": {
          "summary": "Delete user by ID",
          "tags": ["Users"],
          "security": [{ "bearerAuth": [] }],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": { "type": "string" }
            }
          ],
          "responses": {
            "200": { "description": "User deleted successfully" },
            "400": { "description": "Missing user ID" },
            "404": { "description": "User not found" }
          }
        }
      }
    }
  },
  apis: ["src/**/*.ts"] // הנתיבים שבהם הקבצים שלך
};
export const swaggerSpec = swaggerJSDoc(options);
