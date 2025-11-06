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
      "url": "http://localhost:4000"
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
      "put": {
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
      }},

    "/user/getMe/{uid}": {
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
                "required": ["targetUid",  "newRole"]
              }}}
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
                "required": ["title", "description","password"]
              }}}
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
              }}}
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
              }}}
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
              }}}
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
      }},

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
      }},
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
      }},
      "/ideaResponse/create": {
  "post": {
    "summary": "Create idea response (text OR emoji)",
    "tags": ["ideaResponse"],
    "security": [{ "bearerAuth": [] }],
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
    },"responses": {
      "201": { "description": "Response created successfully" }
    }
  }
},
  }
},
  apis: ["src/**/*.ts"] // הנתיבים שבהם הקבצים שלך
};
export const swaggerSpec = swaggerJSDoc(options);
