"use server";

export async function isAdminEmail(email: string): Promise<boolean> {
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim());
  return adminEmails.includes(email.trim());
}
