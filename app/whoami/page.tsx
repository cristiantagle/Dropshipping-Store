export const dynamic = "force-dynamic";
export default function WhoAmI() {
  const ver = {
    commit: process.env.VERCEL_GIT_COMMIT_SHA || "local",
    msg: process.env.VERCEL_GIT_COMMIT_MESSAGE || "",
    branch: process.env.VERCEL_GIT_COMMIT_REF || "",
    project: process.env.VERCEL_PROJECT_PRODUCTION_URL || "",
    ts: new Date().toISOString()
  };
  return (
    <main style={{maxWidth: 840, margin: "40px auto", fontFamily: "ui-sans-serif"}}>
      <h1 style={{fontSize: 28, fontWeight: 700}}>AndesDrop — WhoAmI</h1>
      <p>Datos del deployment en Vercel:</p>
      <pre style={{background:"#f5f5f5", padding:16, borderRadius:8, overflowX:"auto"}}>
{JSON.stringify(ver, null, 2)}
      </pre>
      <p>Si tu dominio muestra otra cosa, no está apuntando a este deployment.</p>
    </main>
  );
}
