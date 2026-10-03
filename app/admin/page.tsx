import { configured, sessionToken } from "../../lib/admin";
import Editor from "./editor";
import "./admin.css";
export const metadata = {
  title: "Content editor | James Cahours",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default async function Admin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const ready = configured(),
    token = ready ? await sessionToken() : null;
  const { error } = await searchParams;
  return (
    <main className="admin">
      <header className="admin-header">
        <a href="/">
          james cahours<span>.</span>
        </a>
        <span>Content studio</span>
        {token && (
          <form action="/api/admin/logout" method="post">
            <button>Sign out</button>
          </form>
        )}
      </header>
      {token ? (
        <Editor />
      ) : (
        <section className="admin-login">
          <p className="admin-eyebrow">YOUR SITE, YOUR WORDS</p>
          <h1>
            A place to keep
            <br />
            things current.
          </h1>
          <p>
            Edit your homepage and projects, then publish when you’re ready.
          </p>
          {!ready ? (
            <div className="admin-notice">
              <strong>One-time setup required</strong>
              <p>
                GitHub sign-in needs to be configured for this site. Follow the
                admin setup instructions in the repository README.
              </p>
            </div>
          ) : (
            <>
              <a className="admin-primary" href="/api/admin/auth">
                Sign in with GitHub
              </a>
              <p className="admin-muted">
                Access is restricted to jamescahours.
              </p>
              {error && (
                <p role="alert">
                  Sign-in didn’t complete. Use your jamescahours GitHub account
                  and try again.
                </p>
              )}
            </>
          )}
        </section>
      )}
    </main>
  );
}
