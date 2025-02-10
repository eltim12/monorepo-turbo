import { db } from "../config/firebaseConfig";
import { User } from "../entities/user";

const USERS_COLLECTION = "USERS";

export class UserRepository {
  static async fetchUserData(userId: string): Promise<User | null> {
    const userDoc = await db.collection(USERS_COLLECTION).doc(userId).get();
    return userDoc.exists ? (userDoc.data() as User) : null;
  }

  static async updateUserData(userId: string, data: Partial<User>): Promise<void> {
    await db.collection(USERS_COLLECTION).doc(userId).set(data, { merge: true });
  }

  static async fetchPotentialUserData(lastDocId: string, pageSize: string,) {
    try {
      const pageSizeNum = parseInt(pageSize as string) || 10;

      let usersQuery = db.collection(USERS_COLLECTION)
        .orderBy("totalAverageWeightRatings", "desc")
        .orderBy("numberOfRents", "desc")
        .orderBy("recentlyActive", "desc")
        .limit(pageSizeNum);

      if (lastDocId) {
        const lastDocRef = await db.collection(USERS_COLLECTION).doc(lastDocId as string).get();
        if (lastDocRef.exists) {
          usersQuery = usersQuery.startAfter(lastDocRef);
        }
      }

      const snapshot = await usersQuery.get();

      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        users,
        lastDocId: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1].id : null,
      };
    } catch (error) {
      console.error("Error fetching potential users:", error);
    }
  }

}
