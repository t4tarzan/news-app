import { NextRequest, NextResponse } from 'next/server';
import { PythonShell } from 'python-shell';
import path from 'path';
import fs from 'fs';
import os from 'os';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;
    const audio = formData.get('audio') as File;

    if (!image || !audio) {
      return NextResponse.json(
        { error: 'Both image and audio files are required' },
        { status: 400 }
      );
    }

    // Save files temporarily
    const timestamp = Date.now();
    const imagePath = path.join(UPLOAD_DIR, `${timestamp}_image${path.extname(image.name)}`);
    const audioPath = path.join(UPLOAD_DIR, `${timestamp}_audio${path.extname(audio.name)}`);
    
    await Promise.all([
      fs.promises.writeFile(imagePath, Buffer.from(await image.arrayBuffer())),
      fs.promises.writeFile(audioPath, Buffer.from(await audio.arrayBuffer()))
    ]);

    // Run SadTalker
    const outputDir = path.join(UPLOAD_DIR, timestamp.toString());
    fs.mkdirSync(outputDir, { recursive: true });

    const options = {
      mode: 'text',
      pythonPath: 'python3',
      pythonOptions: ['-u'],
      scriptPath: path.join(process.cwd(), 'python'),
      args: [
        '--driven_audio', audioPath,
        '--source_image', imagePath,
        '--result_dir', outputDir,
        '--enhancer', 'gfpgan'
      ]
    };

    try {
      await new Promise((resolve, reject) => {
        PythonShell.run('inference.py', options, function (err) {
          if (err) reject(err);
          resolve(null);
        });
      });

      // Find the generated video file
      const files = fs.readdirSync(outputDir);
      const videoFile = files.find(f => f.endsWith('.mp4'));

      if (!videoFile) {
        throw new Error('No video file generated');
      }

      const videoPath = path.join(outputDir, videoFile);
      const videoBuffer = fs.readFileSync(videoPath);

      // Cleanup
      fs.rmSync(imagePath);
      fs.rmSync(audioPath);
      fs.rmSync(outputDir, { recursive: true });

      return new NextResponse(videoBuffer, {
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Disposition': 'attachment; filename="generated_video.mp4"'
        }
      });

    } catch (error) {
      console.error('SadTalker error:', error);
      return NextResponse.json(
        { error: 'Video generation failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
