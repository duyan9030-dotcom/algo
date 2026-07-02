var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => AutoIndexPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  watchedFolders: "",
  updateInterval: 3,
  folderEmoji: "\u{1F4C2}",
  boldFolderNames: true
};
var AutoIndexPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.intervalId = null;
  }
  async onload() {
    console.debug("Loading Auto Index plugin...");
    await this.loadSettings();
    this.addSettingTab(new AutoIndexSettingTab(this.app, this));
    this.startAutoIndex();
    await this.runAutoIndex();
  }
  onunload() {
    this.stopAutoIndex();
  }
  startAutoIndex() {
    if (this.intervalId)
      window.clearInterval(this.intervalId);
    this.intervalId = window.setInterval(() => {
      void this.runAutoIndex();
    }, this.settings.updateInterval * 1e3);
  }
  stopAutoIndex() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  async runAutoIndex() {
    const folders = this.settings.watchedFolders.split("\n").map((f) => f.trim()).filter((f) => f.length > 0);
    if (folders.length === 0) {
      console.debug("Auto Index: No folders to watch.");
      return;
    }
    for (const folderName of folders) {
      await this.updateIndexFile(folderName);
    }
  }
  async updateIndexFile(folderPathStr) {
    const folder = this.app.vault.getAbstractFileByPath(folderPathStr);
    if (!folder || !(folder instanceof import_obsidian.TFolder)) {
      console.warn(`Auto Index: Folder not found or is not a directory: "${folderPathStr}"`);
      return;
    }
    const indexFileName = `${folder.name}.md`;
    const indexFilePath = (0, import_obsidian.normalizePath)(`${folder.path}/${indexFileName}`);
    console.debug(`Auto Index: Updating index for "${folder.path}"...`);
    let header = `# ${folder.name}

`;
    const existingFile = this.app.vault.getAbstractFileByPath(indexFilePath);
    if (existingFile && existingFile instanceof import_obsidian.TFile) {
      const content = await this.app.vault.read(existingFile);
      const lines = content.split("\n");
      if (lines.length > 0 && lines[0].startsWith("#")) {
        header = lines[0];
        if (!header.endsWith("\n"))
          header += "\n";
      }
    }
    const listContent = await this.getFolderContent(folder, "");
    const newContent = (header.endsWith("\n") ? header : header + "\n") + "\n" + listContent;
    if (existingFile instanceof import_obsidian.TFile) {
      const currentContent = await this.app.vault.read(existingFile);
      if (currentContent !== newContent) {
        await this.app.vault.modify(existingFile, newContent);
      }
    } else {
      await this.app.vault.create(indexFilePath, newContent);
    }
  }
  async getFolderContent(folder, indent) {
    let content = "";
    const children = folder.children.slice().sort((a, b) => a.name.localeCompare(b.name));
    const files = [];
    const subdirs = [];
    for (const item of children) {
      if (item.name.startsWith("."))
        continue;
      if (item.name === folder.name + ".md")
        continue;
      if (item instanceof import_obsidian.TFolder) {
        subdirs.push(item);
      } else if (item instanceof import_obsidian.TFile && item.extension === "md") {
        files.push(item);
      }
    }
    for (const f of files) {
      content += `${indent}- [[${f.basename}]]
`;
    }
    for (const subdir of subdirs) {
      const folderNameDisplay = this.settings.boldFolderNames ? `**${subdir.name}**` : subdir.name;
      const emoji = this.settings.folderEmoji ? `${this.settings.folderEmoji} ` : "";
      const displayText = `${emoji}${folderNameDisplay}`;
      content += `${indent}- ${displayText}
`;
      content += await this.getFolderContent(subdir, indent + "	");
    }
    return content;
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
    this.startAutoIndex();
  }
};
var AutoIndexSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("Watched folders").setDesc("One folder path per line").addTextArea((text) => text.setPlaceholder("Example:\nfolder/path\nanother/path").setValue(this.plugin.settings.watchedFolders).onChange(async (value) => {
      this.plugin.settings.watchedFolders = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName("Update interval (seconds)").setDesc("How often to check and update indexes").addText((text) => text.setPlaceholder("3").setValue(String(this.plugin.settings.updateInterval)).onChange(async (value) => {
      const num = parseInt(value);
      if (!isNaN(num) && num > 0) {
        this.plugin.settings.updateInterval = num;
        await this.plugin.saveSettings();
      }
    }));
    new import_obsidian.Setting(containerEl).setName("Folder emoji").setDesc("Emoji or text to display before folder names.").addText((text) => text.setValue(this.plugin.settings.folderEmoji).onChange(async (value) => {
      this.plugin.settings.folderEmoji = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName("Bold folder names").setDesc("If enabled, folder names will be displayed in **bold**.").addToggle((toggle) => toggle.setValue(this.plugin.settings.boldFolderNames).onChange(async (value) => {
      this.plugin.settings.boldFolderNames = value;
      await this.plugin.saveSettings();
    }));
  }
};
//# sourceMappingURL=main.js.map

/* nosourcemap */