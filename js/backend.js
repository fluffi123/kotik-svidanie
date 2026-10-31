// Firebase is loaded lazily and only when config.js has a config,
// so the site still works as a plain static page without it.
import { firebaseConfig } from "../config.js";

const SDK = "https://www.gstatic.com/firebasejs/10.12.2/";
let ready = null;

export const enabled = !!firebaseConfig;

export function fb() {
  if (!enabled) return Promise.resolve(null);
  if (!ready) {
    ready = (async () => {
      const [app, fs, auth] = await Promise.all([
        import(SDK + "firebase-app.js"),
        import(SDK + "firebase-firestore.js"),
        import(SDK + "firebase-auth.js"),
      ]);
      const a = app.initializeApp(firebaseConfig);
      return { fs, auth, db: fs.getFirestore(a), authInst: auth.getAuth(a) };
    })();
  }
  return ready;
}

const timeout = (p, ms) => Promise.race([p, new Promise((_, r) => setTimeout(() => r(new Error("timeout")), ms))]);

// Saves one answer (letter, quiz result, form) for the admin page.
export async function saveAnswer(stage, data) {
  const f = await fb();
  if (!f) throw new Error("not configured");
  const { fs, db } = f;
  await timeout(fs.addDoc(fs.collection(db, "answers"), { stage, data, createdAt: fs.serverTimestamp() }), 10000);
}

// Calls cb({stageId: true}) whenever the admin opens or closes stages; cb(null) when there is no backend.
export async function watchUnlocked(cb) {
  const f = await fb().catch(() => null);
  if (!f) { cb(null); return () => {}; }
  const { fs, db } = f;
  return fs.onSnapshot(fs.doc(db, "config", "state"),
    snap => cb((snap.exists() && snap.data().unlocked) || {}),
    () => cb({}));
}
