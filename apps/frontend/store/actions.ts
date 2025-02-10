import { auth } from "@/apis/user";
import { signInWithEmailAndPassword } from "firebase/auth";
import { loginStart, loginSuccess, loginFailure } from "@/store/authSlice";
import { AppDispatch } from "@/store/store";

export const loginUser = (email: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(loginStart());

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const safeUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || null,
      accessToken: await user.getIdToken(),
      providerData: user.providerData.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })),
    };

    dispatch(loginSuccess(safeUser));
  } catch (error: any) {
    dispatch(loginFailure(error.message));
  }
};
