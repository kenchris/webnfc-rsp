import { openDB } from '../web_modules/idb.js';

let singleton;

export class FileStorage extends EventTarget {
  constructor() {
    super();
    if (!singleton) {
      singleton = this;

      this.fileSelect = document.createElement("input");
      this.fileSelect.type = "file";

      this.dbPromise = openDB('file-store', 1, {
        upgrade(db) {
          db.createObjectStore('certificates');
          const tokensStore = db.createObjectStore('tokens', {
            keyPath: 'token'
          });
        },
      });
    }
    return singleton;
  }

  async chooseFileSystemEntriesFlat(opts) {
    const dir = opts && opts.type == 'openDirectory';

    // Use Native Filesystem API is avaiable.
    if ('chooseFileSystemEntries' in window) {
      const handle = await window.chooseFileSystemEntries(opts);
      if (dir) {
        const files = [];
        for await (const entry of handle.getEntries()) {
          if (entry.isFile) {
            files.push(await entry.getFile());
          }
        }
        return files;
      } else {
        return await handle.getFile();
      }
    }

    return new Promise(resolve => {
      this.fileSelect.webkitdirectory = dir;
      this.fileSelect.addEventListener("change",
        _ => resolve(dir ? this.fileSelect.files : this.fileSelect.files[0]),
        { once: true }
      );
      this.fileSelect.click();
    });
  }

  async certificate() {
    return (await this.dbPromise).get('certificates', 1);
  }

  async chooseCertificate() {
    const file = await this.chooseFileSystemEntriesFlat();
    const contents = await file.arrayBuffer();

    const res = (await this.dbPromise).put('certificates', contents, 1);
  }

  async chooseTokens() {
    const entries = await this.chooseFileSystemEntriesFlat({type: 'openDirectory'});
    const re = new RegExp('^token_[0-9_]+\.json$');

    const db = await this.dbPromise;
    for await (const entry of entries) {
      if (re.test(entry.name)) {
        const file = entry;
        const text = await file.text();
        const json = JSON.parse(text);
        if (json.token) {
          await db.put('tokens', json);
        }
      }
    }
  }

  async tokens() {
    const db = await this.dbPromise;
    return await db.getAll('tokens');
  }

  async removeToken(token) {
    const db = await this.dbPromise;
    await db.delete('tokens', token)
  }
}