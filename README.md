## Project Description
This is a Library Management System built to simplify the management of resources, users, and library operations. It enables librarians to efficiently manage resource catalogs, track resource loans, and returns. The system is designed with scalability and maintainability in mind.

## Design Pattern
The project follows Clean Architecture and Domain-Driven Design (DDD) principles.

# Project Setup Instructions

To clone and set up the project, please ensure you have [pnpm](https://pnpm.io/) installed. If you don’t have it yet, visit the pnpm website for [installation instructions](https://pnpm.io/installation) . Once you have pnpm, follow these steps to configure the environment variables and set up the database and authentication.

### 1. Clone the Repository

Start by cloning the repository from GitHub to your local machine:

```bash
git clone https://github.com/KuroXI/library-management.git
cd ./library-management
```

### 2. Install Dependencies

After cloning the repository, run the following command to install the required packages:

```bash
pnpm install
```

### 3. Set Up Environment Variables

You need to create a .env file based on the provided .env.example. Copy the template file and update the environment variables accordingly:

`bash`
```bash
cp .env.example .env
```

`cmd`
```cmd
copy .env.example .env
```

Update the values in the .env file with required variable keys (such as API keys, database credentials, etc.).

### 4. Create a Supabase PostgreSQL Database

Follow these steps to create a PostgreSQL database using Supabase:

1. Go to [Supabase](https://supabase.com/), sign in, and create a new project.
2. Once the project is created, go to the Database project, click connect, select URI copy your database URL.
3. Update the .env file with your supabase database credentials and replace [YOUR-PASSWORD] with your database password, typically:
```env
DATABASE_URL="postgresql://postgres.[USERNAME]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

### 5. Create Google OAuth Credentials
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to APIs & Services > Credentials.
4. Click Create Credentials, then select OAuth 2.0 Client IDs.
5. Configure the OAuth consent screen and choose Web application as the application type.
6. Add your authorized redirect URIs 
```
http://localhost:3000/api/auth/callback/google
```
8. After creating the credentials, copy the Client ID and Client Secret.
9. Add them to your .env file:
```
GOOGLE_CLIENT_ID="REPLACE_WITH_YOUR_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="REPLACE_WITH_YOUR_GOOGLE_CLIENT_SECRET"
```

More reference: [How to create Google OAuth Credentials (Client ID and Secret)](https://youtu.be/OKMgyF5ezFs)

### 6. Push Database Schema to your Database
```bash
pnpm db:push
```

Check your supabase project, tables should match schema.prisma if nothing happens, try replacing the port of your database URL to 5432 in your .env.

### 7. Start Development Server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.