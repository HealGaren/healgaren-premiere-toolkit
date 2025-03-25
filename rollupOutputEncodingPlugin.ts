import { Plugin } from 'rollup';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';

interface OutputEncodingPluginOptions {
    encoding?: BufferEncoding;
    includeBOM?: boolean;
}

export function outputEncodingPlugin(options: OutputEncodingPluginOptions = {}): Plugin {
    const encoding = options.encoding ?? 'utf8';
    const includeBOM = options.includeBOM ?? (encoding === 'utf16le');

    return {
        name: 'rollup-plugin-output-encoding',

        async writeBundle(outputOptions, bundle) {
            const outDir = outputOptions.dir ?? path.dirname(outputOptions.file ?? 'dist');

            await Promise.all(
                Object.entries(bundle)
                    .filter(([fileName, file]) => file.type === 'chunk' && fileName.endsWith('.js'))
                    .map(async ([fileName]) => {
                        const filePath = path.join(outDir, fileName);

                        try {
                            const originalContent = await readFile(filePath, 'utf8');

                            let buffer: Buffer;
                            if (encoding === 'utf16le') {
                                const contentWithBOM = includeBOM ? '\uFEFF' + originalContent : originalContent;
                                buffer = Buffer.from(contentWithBOM, 'utf16le');
                            } else {
                                buffer = Buffer.from(originalContent, encoding);
                            }

                            await writeFile(filePath, buffer);
                            console.log(`📝 Re-encoded ${fileName} as ${encoding.toUpperCase()}${includeBOM ? ' with BOM' : ''}`);
                        } catch (err) {
                            console.error(`❌ Failed to re-encode ${fileName}:`, err);
                        }
                    })
            );
        }
    };
}