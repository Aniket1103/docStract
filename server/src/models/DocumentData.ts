import mongoose, { Schema, Document } from 'mongoose';

interface DocumentData extends Document {
  originalName: string;
  key: string;
  url: string;
  extractedData: { [key: string]: any };
}

const DocumentSchema = new Schema<DocumentData>({
  originalName: { type: String, required: true },
  key: { type: String, required: true },
  url: { type: String, required: true },
  extractedData: { type: Object, of: Schema.Types.Mixed },
}, {timestamps: true});

const DocumentModel = mongoose.model<DocumentData>(
  'DocumentData',
  DocumentSchema
);

export default DocumentModel;
