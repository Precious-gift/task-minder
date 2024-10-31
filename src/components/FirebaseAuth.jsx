import {
  EmailAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import * as firebaseui from "firebaseui";
import { useEffect } from "react";
import "firebaseui/dist/firebaseui.css";
import { addUserToDb, auth } from "../firebase";
import { useDispatch } from "react-redux";
import { setUser } from "../features/auth/authSlice";
import { Box, Button, Divider } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const FirebaseAuth = () => {
  const dispatch = useDispatch();
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        console.log("token:", token);
        // The signed-in user info.
        const user = result.user;
        console.log("User signed in successfully by pop up:", user);
        const userData = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        };
        dispatch(setUser(userData));
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        console.log("error code:", errorCode);
        const errorMessage = error.message;
        console.log("error message:", errorMessage);
        // The email of the user's account used.
        const email = error.customData.email;
        console.log("email:", email);
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log("credential:", credential);
      });
  };

  useEffect(() => {
    const ui =
      firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    const uiConfig = {
      signInSuccessUrl: "/",
      signInOptions: [EmailAuthProvider.PROVIDER_ID],
      callbacks: {
        signInSuccessWithAuthResult: (authResult) => {
          console.log("Auth result:", authResult);
          const user = authResult.user;
          console.log("User signed in successfully:", user);

          // Dispatch user to Redux store
          if (user) {
            console.log("User signed in successfully:", user);
            const userData = {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
            };
            dispatch(setUser(userData)); // Dispatch user to Redux store
          } else {
            console.log("No user found in auth result");
          }

          return false;
        },
      },
    };

    ui.start("#firebaseui-auth-container", uiConfig);

    console.log("Checking for redirect result...");

    return () => {
      ui.reset();
    };
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Auth state changed, user signed in:", user);
        const userData = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        };
        dispatch(setUser(userData));
        addUserToDb(userData);
      } else {
        console.log("Auth state changed, no user signed in.");
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: 2,
      }}
    >
      <div id="firebaseui-auth-container" />
      <Divider>or</Divider>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleSignIn}
        >
          Google
        </Button>
      </Box>
    </Box>
  );
};
export default FirebaseAuth;
