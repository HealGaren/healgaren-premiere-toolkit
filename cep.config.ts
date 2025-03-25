import { CEP_Config } from "vite-cep-plugin";
import { version } from "./package.json";


const config: CEP_Config = {
  version,
  id: "com.healgaren-premiere-toolkit.cep",
  displayName: "HealGaren's Premiere Toolkit",
  symlink: "local",
  port: 3000,
  servePort: 5000,
  startingDebugPort: 8860,
  extensionManifestVersion: 6.0,
  requiredRuntimeVersion: 9.0,
  hosts: [
    { name: "PPRO", version: "[0.0,99.9]" }
  ],
  type: "Panel",
  iconDarkNormal: "./src/assets/light-icon.png",
  iconNormal: "./src/assets/dark-icon.png",
  iconDarkNormalRollOver: "./src/assets/light-icon.png",
  iconNormalRollOver: "./src/assets/dark-icon.png",
  parameters: ["--v=0", "--enable-nodejs", "--mixed-context"],
  width: 500,
  height: 550,

  panels: [
    {
      mainPath: "./main/index.html",
      name: "main",
      panelDisplayName: "HealGaren's Premiere Toolkit",
      autoVisible: true,
      width: 600,
      height: 650,
    },
    {
      mainPath: "./multiCam/index.html",
      name: "multiCam",
      panelDisplayName: "HealGaren's Premiere Toolkit - MultiCam",
      autoVisible: true,
      type: "Panel",
      width: 600,
      height: 650,
    },
    {
      mainPath: "./setting/index.html",
      name: "setting",
      panelDisplayName: null,
      autoVisible: true,
      type: "Panel",
      width: 600,
      height: 650,
    },
  ],
  build: {
    jsxBin: "off",
    sourceMap: true,
  },
  zxp: {
    country: "US",
    province: "CA",
    org: "MyCompany",
    password: "mypassword",
    tsa: "http://timestamp.digicert.com/",
    sourceMap: false,
    jsxBin: "off",
  },
  installModules: [],
  copyAssets: [],
  copyZipAssets: [],
};
export default config;
