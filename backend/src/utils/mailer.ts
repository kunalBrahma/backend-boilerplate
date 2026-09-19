// No email provider wired up yet — swap this for a real provider
// (Resend, SES, Postmark, etc.) via the blueprint-mcp inject_mail_provider
// tool when the project needs real delivery. For now it just logs, so the
// password-reset flow is usable in local/dev without extra setup.
export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
  console.log(`[mailer] Password reset requested for ${email}. Token: ${token}`);
};
