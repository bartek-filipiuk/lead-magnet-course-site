import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const projectRoot = process.cwd();
const pdfDir = path.join(projectRoot, "pdf");
const previewPort = 4173;
const previewUrl = `http://127.0.0.1:${previewPort}`;
const lessonsFile = path.join(projectRoot, "src/data/lessons.json");
const lessons = JSON.parse(fs.readFileSync(lessonsFile, "utf-8"));

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      cwd: projectRoot,
      stdio: "inherit",
      shell: true
    });

    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed: ${command} ${args.join(" ")}`));
    });
  });
}

async function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // keep trying
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  throw new Error("Preview server did not start in time.");
}

async function exportPdfs() {
  fs.mkdirSync(pdfDir, { recursive: true });

  await runCommand("npm", ["run", "build"]);

  const previewProc = spawn(
    "npm",
    ["run", "preview", "--", "--host", "127.0.0.1", "--port", String(previewPort)],
    {
      cwd: projectRoot,
      stdio: "inherit",
      shell: true
    }
  );

  try {
    await waitForServer(`${previewUrl}/`);

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    for (const lesson of lessons) {
      const lessonUrl = `${previewUrl}/lekcja/${lesson.slug}/`;
      const outputFile = path.join(pdfDir, `${String(lesson.order).padStart(2, "0")}-${lesson.slug}.pdf`);

      await page.goto(lessonUrl, { waitUntil: "networkidle" });
      await page.pdf({
        path: outputFile,
        format: "A4",
        printBackground: true,
        margin: { top: "16mm", right: "12mm", bottom: "16mm", left: "12mm" }
      });

      console.log(`Saved: ${outputFile}`);
    }

    await browser.close();
  } finally {
    previewProc.kill("SIGTERM");
  }
}

exportPdfs().catch((error) => {
  console.error(error);
  process.exit(1);
});
