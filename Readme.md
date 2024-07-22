# Video Streaming Backend Project

This is the backend for a subscription-based video streaming platform. It includes features for user authentication, video streaming, commenting on videos, and integrating tweets.

-[model link](https://app.eraser.io/workspace/2P3VfcrMX8juklKcNBLm?origin=share)

## Features

- **User Authentication**: Sign up, log in, and manage user sessions.
- **Subscription Management**: Handle user subscriptions and payment processing.
- **Video Streaming**: Upload, store, and stream videos to subscribers.
- **Comments**: Allow users to comment on videos and manage their comments.
- **Twitter Integration**: Display relevant tweets and allow users to tweet from the platform.

## Tech Stack

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database for storing user data, subscriptions, videos, and comments
- **JWT**: JSON Web Tokens for secure user authentication
- **Axios**: For making HTTP requests, including to the Twitter API

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB instance running
- Twitter Developer Account for API access

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/your-repo.git
    cd your-repo
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    PORT=4000
    MONGO_URI=your-mongodb-uri
    JWT_SECRET=your-jwt-secret
    TWITTER_API_KEY=your-twitter-api-key
    TWITTER_API_SECRET=your-twitter-api-secret
    ```

### Running the Application

1. Start the server:
    ```sh
    npm start
    ```

2. The server will run on `http://localhost:4000`.

### API Endpoints

#### Authentication

- `POST /api/signup`: Sign up a new user
- `POST /api/login`: Log in an existing user
- `POST /api/logout`: Log out the current user

#### Subscription

- `GET /api/subscription`: Get user subscription details
- `POST /api/subscription`: Create or update a subscription

#### Video Streaming

- `GET /api/videos`: Get a list of all videos
- `POST /api/videos`: Upload a new video
- `GET /api/videos/:id`: Stream a specific video

#### Comments

- `GET /api/videos/:id/comments`: Get comments for a specific video
- `POST /api/videos/:id/comments`: Add a new comment to a video

#### Twitter Integration

- `GET /api/tweets`: Get relevant tweets
- `POST /api/tweets`: Post a new tweet

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- Author: Priyansh
- Email: [your-email@example.com](mailto:your-email@example.com)
- GitHub: [https://github.com/your-username](https://github.com/your-username)
