import { promises as fs } from 'fs';
import path from 'path';
import { createGzip } from 'zlib';
import { pipeline } from 'stream/promises';
import { logger } from './logger.js';
import mongoose from 'mongoose';

const BACKUP_DIR = path.join(process.cwd(), 'backups');

export const createBackup = async () => {
  try {
    // Ensure backup directory exists
    await fs.mkdir(BACKUP_DIR, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${timestamp}.json.gz`;
    const filepath = path.join(BACKUP_DIR, filename);

    // Get all collections
    const collections = mongoose.connection.collections;
    const backup = {};

    for (const [name, collection] of Object.entries(collections)) {
      backup[name] = await collection.find({}).toArray();
    }

    // Create gzipped backup
    const gzip = createGzip();
    const output = fs.createWriteStream(filepath);
    
    const jsonStream = new ReadableStream({
      start(controller) {
        controller.enqueue(JSON.stringify(backup));
        controller.close();
      }
    });

    await pipeline(jsonStream, gzip, output);

    logger.info(`Backup created: ${filepath}`);
    return filepath;
  } catch (error) {
    logger.error('Backup creation failed:', error);
    throw error;
  }
};

export const restoreBackup = async (filepath) => {
  try {
    const gunzip = createGzip();
    const input = fs.createReadStream(filepath);
    
    let data = '';
    await pipeline(
      input,
      gunzip,
      new WritableStream({
        write(chunk) {
          data += chunk;
        }
      })
    );

    const backup = JSON.parse(data);

    // Restore collections
    for (const [name, documents] of Object.entries(backup)) {
      const collection = mongoose.connection.collection(name);
      if (documents.length > 0) {
        await collection.deleteMany({});
        await collection.insertMany(documents);
      }
    }

    logger.info(`Backup restored from: ${filepath}`);
  } catch (error) {
    logger.error('Backup restoration failed:', error);
    throw error;
  }
};

export const listBackups = async () => {
  try {
    const files = await fs.readdir(BACKUP_DIR);
    return files.filter(file => file.endsWith('.json.gz'));
  } catch (error) {
    logger.error('Failed to list backups:', error);
    throw error;
  }
};

export const deleteBackup = async (filename) => {
  try {
    const filepath = path.join(BACKUP_DIR, filename);
    await fs.unlink(filepath);
    logger.info(`Backup deleted: ${filepath}`);
  } catch (error) {
    logger.error('Failed to delete backup:', error);
    throw error;
  }
};