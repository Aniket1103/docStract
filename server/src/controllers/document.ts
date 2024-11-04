import { Request, Response, RequestHandler } from 'express';
import DocumentModel from '../models/DocumentData';
import {
  TextractClient,
  AnalyzeDocumentCommand,
} from '@aws-sdk/client-textract';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../util/awsService';

export const listDocuments = async (req: Request, res: Response) => {
  try {
    const documents = await DocumentModel.find({}).sort({createdAt: -1});
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Documents.' });
  }
};

const textractClient = new TextractClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'your-access-key-id',
    secretAccessKey:
      process.env.AWS_SECRET_ACCESS_KEY || 'your-secret-access-key',
  },
});

// extract text from a document in S3 using AWS Textract
const extractTextFromS3Document = async (
  bucket: string,
  key: string
): Promise<any> => {
  const getObjectCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
  const s3Object = await s3Client.send(getObjectCommand);
  const fileData = await s3Object.Body?.transformToByteArray();

  if (!fileData) throw new Error('Failed to retrieve file from S3');

  const command = new AnalyzeDocumentCommand({
    Document: { Bytes: fileData },
    FeatureTypes: ['FORMS'],
  });

  return textractClient.send(command);
};

// file upload and Textract processing
export const uploadHandler: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const file = req.file as Express.Multer.File & {
    key: string;
    location: string;
  };
  if (!file) {
    res.status(400).send('No file uploaded.');
    return;
  }

  try {
    const bucket = process.env.S3_BUCKET_NAME;
    const key = (file as any).key;

    const textractData = await extractTextFromS3Document(bucket, key);

    const keyValuePairs: Record<string, string> = {};
    const blocks = textractData.Blocks || [];

    blocks.forEach((block) => {
      if (
        block.BlockType === 'KEY_VALUE_SET' &&
        block.EntityTypes?.includes('KEY')
      ) {
        const keyText = blocks.find(
          (b) =>
            b.Id ===
            block.Relationships?.find((rel) => rel.Type === 'CHILD')?.Ids[0]
        )?.Text;

        const valueBlocks = blocks.filter((b) =>
          block.Relationships?.some(
            (rel) => rel.Type === 'VALUE' && rel.Ids.includes(b.Id)
          )
        );

        const valueBlockIds = valueBlocks.flatMap(
          (b) => b.Relationships?.[0]?.Ids || []
        );
        const valueText = blocks
          .filter((b) => b.BlockType === 'WORD' && valueBlockIds.includes(b.Id))
          .map((b) => b.Text)
          .join(' ');

        if (keyText && valueText) {
          keyValuePairs[keyText] = valueText;
        }
      }
    });

    const document = new DocumentModel({
      originalName: file.originalname,
      key: file.key,
      url: file.location,
      extractedData: keyValuePairs,
    });
    await document.save();

    res.status(200).json({
      message: 'File processed successfully!',
      data: keyValuePairs,
    });
  } catch (error) {
    console.error('Error processing file with Textract:', error);
    res.status(500).json({ error: 'Failed to process document' });
  }
};
