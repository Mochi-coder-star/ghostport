# Publish GhostPort with GitHub and Render

No API keys or private environment variables are required for this version.

## 1. Put the project on GitHub

1. Sign in at https://github.com/new.
2. Name the repository `ghostport` (or choose another available name).
3. Choose **Public** so judges can read the code. Create the repository.
4. Use **uploading an existing file**, or **Add file → Upload files**.
5. Upload the **contents** of the extracted GhostPort folder, so these appear at the repository's top level:

```text
render.yaml
package.json
server.mjs
LICENSE
README.md
DEPLOYMENT.md
VALIDATION.md
dist/
  index.html
  app.js
  lessons.js
  style.css
tests/
  parser.test.mjs
  preview.test.mjs
```

Do not upload the ZIP itself or an extra enclosing `ghostport/` directory. The `.openai/` folder is unrelated local metadata and should not be uploaded. Never upload credentials or `.env` files.

6. Commit the uploaded files with a message such as `Build GhostPort Nmap classroom`.

## 2. Connect Render

1. Sign in at https://dashboard.render.com.
2. Select **New → Static Site**.
3. Connect GitHub and select your GhostPort repository. If it is missing, allow Render to access that repository.
4. Use these settings:

| Setting | Value |
|---|---|
| Name | Any available name, such as `ghostport-nmap` |
| Branch | Your repository's default branch, usually `main` |
| Root Directory | Leave blank |
| Build Command | `node --test tests/*.test.mjs` |
| Publish Directory | `dist` |

5. Create/deploy the static site. Static hosting is free within Render's usage limits; avoid selecting a paid web service for this app.
6. Wait for a successful deploy and open the generated HTTPS `.onrender.com` URL. That is the demo link for your DEV entry.

Alternatively, use **New → Blueprint**, connect the same repository and let Render read `render.yaml`; it declares the same static site settings.

## 3. Verify the public demo

- The four lesson buttons work.
- A correct quiz answer updates progress.
- **Wake the ghost** loads Gemma; after the first large download, a question produces an answer.
- A phone-sized screen remains readable.
- Test in a fresh browser or private session to check the first-visit experience.

If Gemma is unavailable on a judge's hardware, include a video showing a real model run as well as the live URL. Clearly label recordings as recordings.

## 4. Submit on DEV

Use the official Week 4 template at https://dev.to/challenges/hacktoberfest-week4-2026-10-26. Include the public repository URL, Render URL or video, explanation of the open-weight model, accurate AI disclosure and tags `devchallenge` and `hf26challenge`. Name Gemma and Render prize categories only once the corresponding integrations are working and demonstrated.

The rules publish the deadline as **October 31, 2026 at 11:59 PM PDT**, equivalent to **November 1 at 1:59 AM in Panama**. A conflicting API timestamp was observed; the written competition rules were checked directly. Publishing the article is a separate action from deploying the app.

References: https://render.com/docs/static-sites and https://render.com/docs/blueprint-spec.
