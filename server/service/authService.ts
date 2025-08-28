import admin from '../Firebase';
export async function setUserRole(uid: string, role: string): Promise<void> {
  // אפשר לשלב לוגיקה עסקית: בדיקות role חוקי וכו'
  const claims = { role, admin: role === 'admin' };
  await admin.auth().setCustomUserClaims(uid, claims);
}
export async function setCustomClaims(uid: string, claims: Record<string, any>): Promise<void> {
  // הבאת claims קיימים (לא חובה, אבל שימושי למיזוג)
  const user = await admin.auth().getUser(uid);
  const existing = (user.customClaims || {}) as Record<string, any>;

  // מיזוג: קיימים + חדשים (חדשים גוברים)
  await admin.auth().setCustomUserClaims(uid, { ...existing, ...claims });
}
