import { chromium, firefox } from "playwright";
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
  const browser = await firefox.launch({
    headless: false,
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
  await page.waitForSelector(
    `//html/body/app-component/main/main-component/div[2]/page-buscar-deuda-component/div[1]/div/div/div[2]/div[1]/div/div[2]/form/div/obj-select-component/div/ul`
  );
  await page.waitForTimeout(500);
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  console.log("inicio");
  for await (const e of placas) {
    await page.fill(`//*[@id="PlacaBusquedainputElemento"]`, e.placa);
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
  await page.waitForTimeout(6000);
  await browser.close();
})();
