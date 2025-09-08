import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, '../data');
const PROJECTS_FILE = join(DB_PATH, 'projects.json');
const EMPLOYEES_FILE = join(DB_PATH, 'employees.json');
const ASSIGNMENTS_FILE = join(DB_PATH, 'assignments.json');

// Ensure data directory exists
import { mkdirSync } from 'fs';
if (!existsSync(DB_PATH)) {
  mkdirSync(DB_PATH, { recursive: true });
}

// Initialize files if they don't exist
const initializeFile = (filePath, defaultData = []) => {
  if (!existsSync(filePath)) {
    writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
};

initializeFile(PROJECTS_FILE);
initializeFile(EMPLOYEES_FILE);
initializeFile(ASSIGNMENTS_FILE);

// Generic database operations
class Database {
  constructor(filePath) {
    this.filePath = filePath;
  }

  // Read all records
  findAll() {
    try {
      const data = readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${this.filePath}:`, error);
      return [];
    }
  }

  // Find record by ID
  findById(id) {
    const records = this.findAll();
    return records.find(record => record.id === id);
  }

  // Create new record
  create(data) {
    try {
      const records = this.findAll();
      const newRecord = {
        ...data,
        id: data.id || this.generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      records.push(newRecord);
      this.saveAll(records);
      return newRecord;
    } catch (error) {
      console.error(`Error creating record in ${this.filePath}:`, error);
      throw error;
    }
  }

  // Update record by ID
  update(id, data) {
    try {
      const records = this.findAll();
      const index = records.findIndex(record => record.id === id);
      
      if (index === -1) {
        return null;
      }
      
      records[index] = {
        ...records[index],
        ...data,
        id, // Ensure ID doesn't change
        updatedAt: new Date().toISOString()
      };
      
      this.saveAll(records);
      return records[index];
    } catch (error) {
      console.error(`Error updating record in ${this.filePath}:`, error);
      throw error;
    }
  }

  // Delete record by ID
  delete(id) {
    try {
      const records = this.findAll();
      const index = records.findIndex(record => record.id === id);
      
      if (index === -1) {
        return false;
      }
      
      const deletedRecord = records.splice(index, 1)[0];
      this.saveAll(records);
      return deletedRecord;
    } catch (error) {
      console.error(`Error deleting record in ${this.filePath}:`, error);
      throw error;
    }
  }

  // Save all records to file
  saveAll(records) {
    try {
      writeFileSync(this.filePath, JSON.stringify(records, null, 2));
    } catch (error) {
      console.error(`Error saving to ${this.filePath}:`, error);
      throw error;
    }
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Find records with custom filter
  findWhere(filterFn) {
    const records = this.findAll();
    return records.filter(filterFn);
  }

  // Count records
  count() {
    return this.findAll().length;
  }
}

// Export database instances
export const projectsDB = new Database(PROJECTS_FILE);
export const employeesDB = new Database(EMPLOYEES_FILE);
export const assignmentsDB = new Database(ASSIGNMENTS_FILE);

export default Database;