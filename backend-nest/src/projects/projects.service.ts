import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { BlobReader, BlobWriter, Entry, ZipReader } from '@zip.js/zip.js';
import { Cache } from 'cache-manager';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  private readonly supabaseUrl: string;
  private readonly supabaseKey: string;
  private readonly bucketName: string;
  private readonly supabase: SupabaseClient;
  private readonly logger = new Logger(FileService.name);
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    this.supabaseUrl = this.configService.get<string>('SUPABASE_PROJECT_URL');
    this.supabaseKey = this.configService.get<string>('SUPABASE_KEY');
    this.bucketName = this.configService.get<string>(
      'SUPABASE_STORAGE_BUCKET_NAME',
    );
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  async readZip(blob: Blob) {
    const reader = new ZipReader(new BlobReader(blob));
    const entries = await reader.getEntries();
    await reader.close();
    return entries;
  }

  async downloadAndExtractFile(filePath: string): Promise<void> {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .download(filePath);
      if (error) throw new Error(error.message);
      const zipEntries = await this.readZip(data);
      await this.handleCache(zipEntries);
    } catch (error) {
      this.logger.error(`Failed to download or extract the ZIP file: ${error}`);
      throw error;
    }
  }

  private async handleCache(entries: Entry[]) {
    const safeParseJSON = (jsonString: string) => {
      try {
        const parsedData = JSON.parse(jsonString);
        if (typeof parsedData === 'object' && parsedData !== null) {
          return parsedData as JSON;
        } else {
          throw new Error('Parsed value is not a valid JSON object or array');
        }
      } catch (error) {
        throw new Error(`Invalid JSON: ${error.message}`);
      }
    };

    this.logger.log(`Caching voices into __dirname: ${__dirname}...`);
    let cachedCount = 0;
    for (const entry of entries) {
      const dataBlob = await entry.getData(new BlobWriter());
      const dataBuffer = await dataBlob
        .arrayBuffer()
        .then((arrayBuffer) => Buffer.from(arrayBuffer));
      if (path.basename(entry.filename) === 'metadata.json') {
        // Cache metadata
        const jsonString = dataBuffer.toString('utf8');
        const jsonData = safeParseJSON(jsonString);
        try {
          await this.cacheMetadata('newCachedAudioMetadata', jsonData);
          this.logger.log(`Metadata cached`);
        } catch (error) {
          this.logger.error(`Failed to cache metadata: ${error}`);
        }
      } else {
        // Cache audio files
        try {
          await this.cacheAudioFile(dataBuffer, entry.filename);
          cachedCount++;
        } catch (error) {
          this.logger.error(`Failed to cache audio file: ${error}`);
        }
      }
    }
    this.logger.log(`${cachedCount}/${entries.length - 1} audio files cached`);
  }

  private cacheMetadata(voiceName: string, jsonData: JSON): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('caching metadata');
        await this.cacheManager.set(`${voiceName}`, jsonData, 30 * 60 * 1000);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  private cacheAudioFile(buffer: Buffer, filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const fullPath = path.join(this.cacheDir, filename);
      const targetPath = path.dirname(fullPath);

      // Check if dir exists
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
      }

      // Check if file already exists
      if (fs.existsSync(fullPath)) {
        resolve();
        return;
      }

      fs.writeFile(fullPath, buffer, (err) => {
        if (err) {
          console.error('Error saving the file:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  getAudioFile(filename: string) {
    const filePath = path.join(this.cacheDir, filename);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error('Error reading the file:', err);
        return;
      }
      // 处理文件数据，例如发送给客户端
      console.log('File read successfully!');
    });
  }

  cleanupOldFiles(dir: string, maxAgeInMins: number): void {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const { mtime } = fs.statSync(filePath);

      if (
        (new Date().getTime() - new Date(mtime).getTime()) / (1000 * 60) >
        maxAgeInMins
      ) {
        // fs.unlinkSync(filePath);
        fs.rmSync(filePath, {
          force: true,
          recursive: true,
          retryDelay: 1000,
          maxRetries: 10,
        });
        this.logger.log(`Deleted old file: ${file}`);
      }
    });
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  handleCron(): void {
    try {
      this.logger.debug('Running cleanup task....');
      if (fs.existsSync(this.cacheDir)) {
        this.cleanupOldFiles(this.cacheDir, 30);
      }
    } catch (error) {
      this.logger.error('Error during cleanup task', error);
    }
  }

  private get cacheDir(): string {
    return path.join(__dirname, 'audioCache');
  }

  get supabaseProjectUrl(): string {
    return this.supabaseUrl;
  }
}

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private fileService: FileService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getCachedMetadata() {
    const value = await this.cacheManager.get('newCachedAudioMetadata');
    return value;
  }

  async getAudio(userId: string, voiceName: string) {
    return await this.fileService.downloadAndExtractFile(
      `voices/${userId}/${voiceName}`,
    );
  }
}
