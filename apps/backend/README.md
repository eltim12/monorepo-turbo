# Backend Repository Documentation

## Setup Instructions

### 1. Getting `serviceAccountKey.json`
To use Firebase Firestore in this backend project, you need to generate a service account key from Firebase.

#### **Steps to Get `serviceAccountKey.json`**:
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your Firebase project.
3. Click on the **gear icon** ⚙️ in the left sidebar and go to **Project settings**.
4. Navigate to the **Service accounts** tab.
5. Click on **Generate new private key**.
6. This will download a JSON file (`serviceAccountKey.json`).
7. Move this file to the `config/` directory of your project.

#### **Ensure Security:**
- **DO NOT** commit this file to GitHub.
- Add it to `.gitignore` to prevent accidental commits.

```gitignore
config/serviceAccountKey.json
```

---

## API Endpoints

### 1️⃣ **Fetch User Data**
- **Endpoint:** `GET /api/fetch-user-data`
- **Description:** Fetches user data from Firestore based on the authentication token.
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <your-token>"
  }
  ```
- **Response:**
  ```json
  {
    "uid": "user123",
    "email": "user@example.com",
    "name": "John Doe"
  }
  ```

### 2️⃣ **Update User Data**
- **Endpoint:** `PUT /api/update-user-data`
- **Description:** Updates Firestore user data for the authenticated user.
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <your-token>",
    "Content-Type": "application/json"
  }
  ```
- **Request Body:**
  ```json
  {
    "email": "newemail@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User data updated successfully"
  }
  ```

### 3️⃣ **Fetch Potential User Data**
- **Endpoint:** `GET /api/fetch-potential-user-data`
- **Description:** Fetches a list of potential users from Firestore. No headers or body are needed.
- **Explanation:** <br>
  `The Logic:`
  1. First Priority: Sort by ratings (highest first)
  2. Tiebreaker 1: If ratings are equal → sort by total rentals (most first)
  3. Tiebreaker 2: If ratings AND rentals are equal → sort by recent activity (newest first)
  
  `The Firestore Query:`
  ```javascript
    usersRef
      .orderBy("totalAverageWeightRatings", "desc")
      .orderBy("numberOfRents", "desc")
      .orderBy("recentlyActive", "desc")
      .limit(10) // Adjust limit for pagination
  ```
  
  `How Pagination Works:`
    1. Get the last user's data from the current page
    2. Use startAfter(lastUser.rating, lastUser.rents, lastUser.activity)
    3. This tells Firestore: "Show me next users after these values"
  
  `Example with Your Data:`
    - All users have 4.3 rating → we check rentals next
    - User A & B have 30 rentals → we check activity last
    - User A (Feb 7) is newer than B (Feb 4) → A comes first
    -User C has 28 rentals → comes last automatically

  `No Complex Math Needed:`
    - Firestore handles the sorting automatically once you specify the order. Think of it like sorting words alphabetically, but with numbers and dates instead of letters.
- **Query Parameters (optional):**
  - `lastDocId` (string): The last document ID from the previous query (for pagination).
  - `pageSize` (number): The number of users to fetch per request.
- **Example Request:**
  ```
  GET /api/fetch-potential-user-data?pageSize=10&lastDocId=abc123
  ```
- **Response:**
  ```json
  [
    {
      "uid": "user123",
      "email": "user@example.com",
      "name": "John Doe"
    },
    {
      "uid": "user456",
      "email": "user2@example.com",
      "name": "Jane Doe"
    }
  ]
  ```

---

## Run the Project

To start the backend server, run the following command:

```bash
npm run dev
```

- This will start the Express server using **nodemon** for live-reloading.
- By default, the server runs on **port 5000**.

If you need to change the port, modify the `PORT` variable in your environment settings.