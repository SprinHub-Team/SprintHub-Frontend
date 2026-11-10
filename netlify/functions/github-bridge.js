export default async (request) => {
  if (request.method !== "POST") {
    return new Response("Método no permitido", { status: 405 });
  }

  try {
    const body = await request.json();
    const githubUrl = "https://github.com/SprinHub-Team/SprintHub-Frontend";

    const githubResponse = await fetch(githubUrl, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GH_PAT_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "Netlify-Serverless-Bridge",
      },
      body: JSON.stringify({
        event_type: "netlify_deploy_success",
        client_payload: {
          url: body.ssl_url || body.url || "https://sprinthubs.netlify.app",
        },
      }),
    });

    if (!githubResponse.ok) {
      const errorText = await githubResponse.text();
      console.error("Error devuelto por GitHub:", errorText);
      return new Response(`Error en GitHub: ${githubResponse.status}`, {
        status: 500,
      });
    }

    return new Response("GitHub notificado con éxito", { status: 200 });
  } catch (error) {
    console.error("Error en la función puente:", error);
    return new Response("Error interno del servidor", { status: 500 });
  }
};
