## Document Processing Application Architecture

This document provides an overview of the architecture, functionality, and components involved in the document processing application.

---

### 1. **Client Side**

- **Frameworks and Tools**: React.js with TypeScript
- **Core Functionalities**:
  - **Document Capture and Upload**: Users can either capture documents through a webcam or upload files directly from local storage.
  - **Document Data Extraction Display**: After uploading a document, the extracted data is displayed in a key-value format to the user.
  - **Accessing Previous Documents**: A "Docs" tab in the navigation bar allows users to access a list of previously uploaded documents.
  
- **Data Flow**:
  1. **Document Capture/Upload**: User captures or selects a document, which is then prepared for upload to the backend.
  2. **Data Display**: After processing, the client displays extracted key-value pairs received from the backend.
  3. **Document Retrieval**: When users access the "Docs" tab, the client retrieves metadata and details of previously processed documents from the backend for display.

---

### 2. **Backend Server**

- **Frameworks and Tools**: Express.js with TypeScript
- **Core Functionalities**:
  - **Document Storage**: The backend uploads each document to an AWS S3 bucket.
  - **Data Extraction**: Using AWS Textract, the backend processes the uploaded document to extract key-value data.
  - **Data Storage**: The extracted data is stored in a MongoDB database with document metadata, such as original filename, S3 URL, and extracted key-value pairs.

- **Data Flow**:
  1. **Document Reception**: The backend receives the document file from the client.
  2. **Document Upload to S3**: The backend uploads the document to AWS S3 for secure storage.
  3. **Data Extraction with Textract**: AWS Textract analyzes the document for text extraction, focusing on identifying key-value pairs.
  4. **Database Storage**: Extracted data and document metadata are saved in MongoDB.
  5. **Response to Client**: The backend sends the extracted key-value data and metadata to the client for display.

---

### 3. **AWS Services**

- **S3**:
  - **Purpose**: Stores uploaded documents in a secure and scalable manner.
  - **Usage**: Documents are uploaded to S3 by the backend upon receiving a file from the client. The S3 URL is stored in MongoDB for future access.
  
- **Textract**:
  - **Purpose**: Extracts text and structured data (key-value pairs) from uploaded documents.
  - **Usage**: Textract processes the document from S3, analyzing it to identify structured information. The extracted data is then used for displaying to the user and stored in MongoDB.

---

### 4. **MongoDB Database**

- **Purpose**: Stores document metadata and extracted data.
- **Data Structure**:
  - Each document entry in MongoDB includes:
    - `_id`: Unique identifier for each document.
    - `originalName`: Original file name of the document.
    - `url`: S3 URL for accessing the document.
    - `extractedData`: Key-value pairs extracted by Textract.

- **Access Patterns**:
  - **Document Storage**: Each new document and its extracted data are stored as a new entry.
  - **Document Retrieval**: When the user accesses the "Docs" tab, the backend retrieves all stored documents to display metadata.

---

### Summary of Workflow

1. **Client Uploads Document** → Backend
2. **Backend Uploads to S3** → Document Stored in S3
3. **Backend Processes with Textract** → Key-Value Data Extracted
4. **Data Stored in MongoDB** → Metadata and Extracted Data Stored
5. **Data Displayed on Client**