const fs = require("fs");
const path = require("path");
const { app } = require("electron");

class SongsStore {
  constructor() {
    // Store songs in app's user data directory
    const userDataPath = app.getPath("userData");
    this.filePath = path.join(userDataPath, "songs.json");
    this.songs = this.load();
  }

  // Load songs from JSON file
  load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, "utf-8");
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("Error loading songs:", error);
    }
    return [];
  }

  // Save songs to JSON file
  save() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(this.songs, null, 2));
    } catch (error) {
      console.error("Error saving songs:", error);
    }
  }

  // Get all songs
  getAll() {
    return this.songs.sort((a, b) => a.title.localeCompare(b.title));
  }

  // Get song by ID
  getById(id) {
    return this.songs.find((song) => song.id === id);
  }

  // Search songs by title (partial, case-insensitive)
  search(query) {
    if (!query || query.trim() === "") {
      return this.getAll();
    }
    const lowerQuery = query.toLowerCase().trim();
    return this.songs
      .filter((song) => song.title.toLowerCase().includes(lowerQuery))
      .sort((a, b) => {
        // Prioritize titles that start with the query
        const aStarts = a.title.toLowerCase().startsWith(lowerQuery);
        const bStarts = b.title.toLowerCase().startsWith(lowerQuery);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.title.localeCompare(b.title);
      });
  }

  // Create a new song
  create(title, lyrics) {
    const song = {
      id: crypto.randomUUID(),
      title: title.trim(),
      lyrics: lyrics.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.songs.push(song);
    this.save();
    return song;
  }

  // Update an existing song
  update(id, title, lyrics) {
    const index = this.songs.findIndex((song) => song.id === id);
    if (index === -1) {
      return null;
    }
    this.songs[index] = {
      ...this.songs[index],
      title: title.trim(),
      lyrics: lyrics.trim(),
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.songs[index];
  }

  // Delete a song
  delete(id) {
    const index = this.songs.findIndex((song) => song.id === id);
    if (index === -1) {
      return false;
    }
    this.songs.splice(index, 1);
    this.save();
    return true;
  }
}

module.exports = SongsStore;
