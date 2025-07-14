#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import path from "path";
import { execSync } from "child_process";

class DevHelperMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "dev-helper-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "create_mern_project",
            description: "Create a new MERN stack project structure",
            inputSchema: {
              type: "object",
              properties: {
                projectName: {
                  type: "string",
                  description: "Name of the project",
                },
                path: {
                  type: "string",
                  description: "Path where to create the project",
                },
              },
              required: ["projectName", "path"],
            },
          },
          {
            name: "generate_component",
            description: "Generate a React component with boilerplate",
            inputSchema: {
              type: "object",
              properties: {
                componentName: {
                  type: "string",
                  description: "Name of the React component",
                },
                componentType: {
                  type: "string",
                  enum: ["functional", "class"],
                  description: "Type of component to generate",
                },
                withStyles: {
                  type: "boolean",
                  description: "Include CSS module file",
                },
              },
              required: ["componentName"],
            },
          },
          {
            name: "create_api_route",
            description: "Create an Express API route with boilerplate",
            inputSchema: {
              type: "object",
              properties: {
                routeName: {
                  type: "string",
                  description: "Name of the API route",
                },
                methods: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: ["GET", "POST", "PUT", "DELETE"],
                  },
                  description: "HTTP methods to include",
                },
                withAuth: {
                  type: "boolean",
                  description: "Include authentication middleware",
                },
              },
              required: ["routeName", "methods"],
            },
          },
          {
            name: "create_mongoose_model",
            description: "Create a Mongoose model with schema",
            inputSchema: {
              type: "object",
              properties: {
                modelName: {
                  type: "string",
                  description: "Name of the Mongoose model",
                },
                fields: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      type: { type: "string" },
                      required: { type: "boolean" },
                    },
                    required: ["name", "type"],
                  },
                  description: "Fields for the model",
                },
              },
              required: ["modelName", "fields"],
            },
          },
          {
            name: "project_status",
            description: "Get current project structure and status",
            inputSchema: {
              type: "object",
              properties: {
                projectPath: {
                  type: "string",
                  description: "Path to the project",
                },
              },
              required: ["projectPath"],
            },
          },
          {
            name: "docker_init",
            description: "Initialize Docker configuration for the project",
            inputSchema: {
              type: "object",
              properties: {
                projectPath: {
                  type: "string",
                  description: "Path to the project",
                },
                services: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: ["client", "server", "database", "nginx"],
                  },
                  description: "Services to include in Docker setup",
                },
              },
              required: ["projectPath", "services"],
            },
          },
          {
            name: "create_dockerfile",
            description: "Create Dockerfile for a specific service",
            inputSchema: {
              type: "object",
              properties: {
                service: {
                  type: "string",
                  enum: ["client", "server"],
                  description: "Service type",
                },
                projectPath: {
                  type: "string",
                  description: "Path to the project",
                },
                nodeVersion: {
                  type: "string",
                  description: "Node.js version to use",
                  default: "18-alpine",
                },
              },
              required: ["service", "projectPath"],
            },
          },
          {
            name: "setup_nodejs_env",
            description: "Set up Node.js environment configuration",
            inputSchema: {
              type: "object",
              properties: {
                projectPath: {
                  type: "string",
                  description: "Path to the project",
                },
                envType: {
                  type: "string",
                  enum: ["development", "production", "testing"],
                  description: "Environment type",
                },
                dependencies: {
                  type: "array",
                  items: { type: "string" },
                  description: "Additional dependencies to install",
                },
              },
              required: ["projectPath", "envType"],
            },
          },
          {
            name: "create_package_scripts",
            description: "Create npm scripts for development workflow",
            inputSchema: {
              type: "object",
              properties: {
                projectPath: {
                  type: "string",
                  description: "Path to the project",
                },
                scripts: {
                  type: "object",
                  description: "Custom scripts to add",
                },
              },
              required: ["projectPath"],
            },
          },
        ] as Tool[],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "create_mern_project":
            return await this.createMernProject(args as any);
          case "generate_component":
            return await this.generateComponent(args as any);
          case "create_api_route":
            return await this.createApiRoute(args as any);
          case "create_mongoose_model":
            return await this.createMongooseModel(args as any);
          case "project_status":
            return await this.getProjectStatus(args as any);
          case "docker_init":
            return await this.dockerInit(args as any);
          case "create_dockerfile":
            return await this.createDockerfile(args as any);
          case "setup_nodejs_env":
            return await this.setupNodejsEnv(args as any);
          case "create_package_scripts":
            return await this.createPackageScripts(args as any);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    });
  }

  private async createMernProject(args: { projectName: string; path: string }) {
    const projectPath = path.join(args.path, args.projectName);
    
    await fs.mkdir(projectPath, { recursive: true });
    await fs.mkdir(path.join(projectPath, "client"), { recursive: true });
    await fs.mkdir(path.join(projectPath, "server"), { recursive: true });
    
    const packageJson = {
      name: args.projectName,
      version: "1.0.0",
      description: "MERN stack application",
      scripts: {
        "dev": "concurrently \"npm run server\" \"npm run client\"",
        "server": "cd server && npm run dev",
        "client": "cd client && npm start",
        "build": "cd client && npm run build",
        "install-deps": "npm install && cd server && npm install && cd ../client && npm install"
      },
      devDependencies: {
        "concurrently": "^8.2.0"
      }
    };

    await fs.writeFile(
      path.join(projectPath, "package.json"),
      JSON.stringify(packageJson, null, 2)
    );

    return {
      content: [
        {
          type: "text",
          text: `Created MERN project "${args.projectName}" at ${projectPath}`,
        },
      ],
    };
  }

  private async generateComponent(args: {
    componentName: string;
    componentType?: string;
    withStyles?: boolean;
  }) {
    const componentType = args.componentType || "functional";
    const withStyles = args.withStyles || false;

    let componentCode = "";
    
    if (componentType === "functional") {
      componentCode = `import React from 'react';
${withStyles ? `import styles from './${args.componentName}.module.css';` : ''}

const ${args.componentName} = () => {
  return (
    <div${withStyles ? ` className={styles.container}` : ''}>
      <h1>${args.componentName} Component</h1>
    </div>
  );
};

export default ${args.componentName};`;
    } else {
      componentCode = `import React, { Component } from 'react';
${withStyles ? `import styles from './${args.componentName}.module.css';` : ''}

class ${args.componentName} extends Component {
  render() {
    return (
      <div${withStyles ? ` className={styles.container}` : ''}>
        <h1>${args.componentName} Component</h1>
      </div>
    );
  }
}

export default ${args.componentName};`;
    }

    let output = `Generated ${args.componentName} component:\n\n${componentCode}`;

    if (withStyles) {
      const cssCode = `.container {
  padding: 20px;
  text-align: center;
}`;
      output += `\n\nCSS Module (${args.componentName}.module.css):\n\n${cssCode}`;
    }

    return {
      content: [
        {
          type: "text",
          text: output,
        },
      ],
    };
  }

  private async createApiRoute(args: {
    routeName: string;
    methods: string[];
    withAuth?: boolean;
  }) {
    const routeCode = `const express = require('express');
const router = express.Router();
${args.withAuth ? "const auth = require('../middleware/auth');" : ""}

${args.methods.map(method => {
  const methodLower = method.toLowerCase();
  return `// ${method} ${args.routeName}
router.${methodLower}('/'${args.withAuth ? ', auth' : ''}, async (req, res) => {
  try {
    // TODO: Implement ${method} logic for ${args.routeName}
    res.json({ message: '${method} ${args.routeName} endpoint' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`;
}).join('\n\n')}

module.exports = router;`;

    return {
      content: [
        {
          type: "text",
          text: `Generated API route for ${args.routeName}:\n\n${routeCode}`,
        },
      ],
    };
  }

  private async createMongooseModel(args: {
    modelName: string;
    fields: Array<{ name: string; type: string; required?: boolean }>;
  }) {
    const schemaFields = args.fields.map(field => {
      let fieldDef = `${field.type}`;
      if (field.required) {
        fieldDef = `{ type: ${field.type}, required: true }`;
      }
      return `  ${field.name}: ${fieldDef}`;
    }).join(',\n');

    const modelCode = `const mongoose = require('mongoose');

const ${args.modelName.toLowerCase()}Schema = new mongoose.Schema({
${schemaFields}
}, {
  timestamps: true
});

module.exports = mongoose.model('${args.modelName}', ${args.modelName.toLowerCase()}Schema);`;

    return {
      content: [
        {
          type: "text",
          text: `Generated Mongoose model for ${args.modelName}:\n\n${modelCode}`,
        },
      ],
    };
  }

  private async getProjectStatus(args: { projectPath: string }) {
    try {
      const files = await fs.readdir(args.projectPath);
      const structure = await this.getDirectoryStructure(args.projectPath);
      
      return {
        content: [
          {
            type: "text",
            text: `Project structure for ${args.projectPath}:\n\n${structure}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Cannot read project at ${args.projectPath}: ${error}`);
    }
  }

  private async getDirectoryStructure(dir: string, prefix = ""): Promise<string> {
    const items = await fs.readdir(dir);
    let structure = "";
    
    for (const item of items) {
      if (item.startsWith('.')) continue;
      
      const itemPath = path.join(dir, item);
      const stats = await fs.stat(itemPath);
      
      if (stats.isDirectory()) {
        structure += `${prefix}📁 ${item}/\n`;
        const subStructure = await this.getDirectoryStructure(itemPath, prefix + "  ");
        structure += subStructure;
      } else {
        structure += `${prefix}📄 ${item}\n`;
      }
    }
    
    return structure;
  }

  private async dockerInit(args: { projectPath: string; services: string[] }) {
    const dockerComposeContent = `version: '3.8'

services:
${args.services.includes('database') ? `  mongodb:
    image: mongo:latest
    container_name: mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: password
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - app-network

` : ''}${args.services.includes('server') ? `  server:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: server
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://root:password@mongodb:27017/myapp?authSource=admin
    depends_on:
      - mongodb
    networks:
      - app-network

` : ''}${args.services.includes('client') ? `  client:
    build:
      context: ./client
      dockerfile: Dockerfile
    container_name: client
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:5000
    depends_on:
      - server
    networks:
      - app-network

` : ''}${args.services.includes('nginx') ? `  nginx:
    image: nginx:alpine
    container_name: nginx
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - client
      - server
    networks:
      - app-network

` : ''}networks:
  app-network:
    driver: bridge

volumes:${args.services.includes('database') ? `
  mongodb_data:` : ''}`;

    await fs.writeFile(
      path.join(args.projectPath, "docker-compose.yml"),
      dockerComposeContent
    );

    // Create .dockerignore
    const dockerignoreContent = `node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
.coverage
*.log`;

    await fs.writeFile(
      path.join(args.projectPath, ".dockerignore"),
      dockerignoreContent
    );

    return {
      content: [
        {
          type: "text",
          text: `Docker configuration initialized with services: ${args.services.join(', ')}`,
        },
      ],
    };
  }

  private async createDockerfile(args: { 
    service: string; 
    projectPath: string; 
    nodeVersion?: string; 
  }) {
    const nodeVersion = args.nodeVersion || "18-alpine";
    let dockerfile = "";

    if (args.service === "server") {
      dockerfile = `FROM node:${nodeVersion}

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

USER node

CMD ["npm", "start"]`;
    } else if (args.service === "client") {
      dockerfile = `FROM node:${nodeVersion} AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]`;
    }

    const servicePath = path.join(args.projectPath, args.service);
    await fs.writeFile(
      path.join(servicePath, "Dockerfile"),
      dockerfile
    );

    return {
      content: [
        {
          type: "text",
          text: `Created Dockerfile for ${args.service} service:\n\n${dockerfile}`,
        },
      ],
    };
  }

  private async setupNodejsEnv(args: { 
    projectPath: string; 
    envType: string; 
    dependencies?: string[]; 
  }) {
    const envContent = `# ${args.envType.toUpperCase()} Environment Variables
NODE_ENV=${args.envType}
PORT=5000
MONGODB_URI=mongodb://localhost:27017/myapp
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=27017
DB_NAME=myapp

# API Configuration
API_VERSION=v1
API_PREFIX=/api

# Security
BCRYPT_ROUNDS=10
JWT_EXPIRES_IN=7d

# Email Configuration (if needed)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-password

# File Upload
MAX_FILE_SIZE=5mb
UPLOAD_DIR=uploads/
`;

    await fs.writeFile(
      path.join(args.projectPath, `.env.${args.envType}`),
      envContent
    );

    // Create .env.example
    const envExample = envContent.replace(/=.+$/gm, '=');
    await fs.writeFile(
      path.join(args.projectPath, ".env.example"),
      envExample
    );

    // Install dependencies if provided
    if (args.dependencies && args.dependencies.length > 0) {
      const installCommand = `cd ${args.projectPath} && npm install ${args.dependencies.join(' ')}`;
      try {
        execSync(installCommand, { stdio: 'inherit' });
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Environment setup completed but failed to install dependencies: ${error}`,
            },
          ],
        };
      }
    }

    return {
      content: [
        {
          type: "text",
          text: `Node.js ${args.envType} environment configured with .env.${args.envType} and .env.example files`,
        },
      ],
    };
  }

  private async createPackageScripts(args: { 
    projectPath: string; 
    scripts?: Record<string, string>; 
  }) {
    const packageJsonPath = path.join(args.projectPath, "package.json");
    
    let packageJson: any = {};
    try {
      const packageContent = await fs.readFile(packageJsonPath, 'utf8');
      packageJson = JSON.parse(packageContent);
    } catch (error) {
      // If package.json doesn't exist, create a basic one
      packageJson = {
        name: path.basename(args.projectPath),
        version: "1.0.0",
        description: "",
        main: "index.js",
        scripts: {}
      };
    }

    // Default scripts for a typical Node.js project
    const defaultScripts = {
      "start": "node server.js",
      "dev": "nodemon server.js",
      "build": "echo 'No build script defined'",
      "test": "jest",
      "lint": "eslint .",
      "lint:fix": "eslint . --fix",
      "format": "prettier --write .",
      "prepare": "husky install"
    };

    // Merge with existing scripts and custom scripts
    packageJson.scripts = {
      ...defaultScripts,
      ...packageJson.scripts,
      ...args.scripts
    };

    await fs.writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2)
    );

    return {
      content: [
        {
          type: "text",
          text: `Package scripts updated in ${packageJsonPath}:\n\n${JSON.stringify(packageJson.scripts, null, 2)}`,
        },
      ],
    };
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

const server = new DevHelperMCPServer();
server.run().catch(console.error);