import { chromium } from "playwright";
import csvParser from "csv-parser";
import fs from "fs";
let placas: any = [];
fs.createReadStream("./data.csv")
  .pipe(csvParser())
  .on("data", (data) => {
    placas.push(data);
  })
  .on("end", () => {
    console.log("placas leidas");
  });
(async () => {
  const pathToExtension =
    "./extensions/pgojnojmmhpofjgdmaebadhbocahppod/1.15.5_0/";
  const browser = await chromium.launchPersistentContext("userDataDir", {
    headless: false,
    acceptDownloads: true,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
    ],
  });
  const page = await browser.newPage();
  const tabs = async (n: number) => {
    for (let i = 0; i < n; i++) {
      await page.keyboard.press("Tab");
    }
  };

  await page.goto("https://pasarela.atu.gob.pe/");
  await page.waitForSelector(`//*[@id="aTriggerExpanderMain"]`);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await tabs(10);
  await page.keyboard.press("Enter");
  await page.waitForLoadState("networkidle");
  console.log("cargo");
  await tabs(6);
  await page.keyboard.press("Enter");
  await page.locator("span").getByText("Por Placa").click();
  await page.keyboard.press("Escape");
  await tabs(5);
  for await (const e of placas) {
    await page.keyboard.insertText(e.placa);
    console.log("%cindex.ts:47 e.placa", "color: #007acc;", e.placa);
    await page.keyboard.press("Enter");
    await page.keyboard.press("Escape");
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.waitForTimeout(5000);
  }
  await browser.close();
})();
