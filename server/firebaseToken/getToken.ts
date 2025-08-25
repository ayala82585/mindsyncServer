const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

const firebaseConfig = {
  apiKey: "AIzaSyB3AH5cblUz82rwCrVzA5MyL3X3cAmUiJM", 
  authDomain: "mindsync-b978b.firebaseapp.com",
  projectId: "mindsync-b978b",
  storageBucket: "mindsync-b978b.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const USER_EMAIL = "sury108683@gmail.com"; 
const USER_PASSWORD = "108683"; 

async function getFirebaseIdToken() {
  try {
    console.log(`נסה להתחבר כמשתמש: ${USER_EMAIL}`);
    const userCredential = await signInWithEmailAndPassword(auth, USER_EMAIL, USER_PASSWORD);
    const user = userCredential.user;
    console.log(`התחברת בהצלחה! UID: ${user.uid}`);
    // קבלת ה-ID Token
    const idToken = await user.getIdToken();

    console.log("\n=============================================");
    console.log("             Firebase ID Token:              ");
    console.log("=============================================");
    console.log(idToken);
    console.log("=============================================\n");
    console.log("הטוקן הועתק לקונסול. השתמש בו ב-Postman.");
    console.log("שים לב: תוקפו של הטוקן פג תוך כשעה.");

  } catch (error) {
    console.error("\n*** שגיאה בקבלת הטוקן: ***");
    console.error("קוד שגיאה:");
    console.error("הודעת שגיאה:");
    console.error("\nודא שפרטי ה-firebaseConfig נכונים, והמשתמש (אימייל וסיסמה) קיים ומאופשר ב-Firebase Authentication.");
  } finally {
    // יציאה מהתהליך לאחר קבלת הטוקן או שגיאה
    // process.exit(0);
  }
}

getFirebaseIdToken();
