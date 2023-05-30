import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { PineconeClient } from "@pinecone-database/pinecone";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { CharacterTextSplitter } from "langchain/text_splitter";

/**
 *
 * WARNING: THIS IS THE SOLUTION! Please try coding before viewing this.
 *
 */

// Example: https://js.langchain.com/docs/modules/indexes/document_loaders/examples/file_loaders/pdf

/**
 * 
 *  INSTRUCTIONS
 * 1. Run with book
        error {
        name: 'PineconeError',
        source: 'server',
        message: 'PineconeClient: Error calling upsert: PineconeError: metadata size is 140052 bytes, which exceeds the limit of 40960 bytes per vector',
        stack: ''
        }
 * 2. Explain why -- vector meta data sizes is too big.
    Language Models are often limited by the amount of text that you can pass to them. Therefore, it is neccessary to split them up into smaller chunks. LangChain provides several utilities for doing so.
        https://js.langchain.com/docs/modules/indexes/text_splitters/
        
        Play with chunk sizes... too small and you can't understand.
        Fine tune this to your liking.
        More vectors = more $$


        3. Pinecone size 1536
        https://platform.openai.com/docs/guides/embeddings/second-generation-models

    4. Upsert metadata size -- add this after split Docs
    
      // Reduce the size of the metadata for each document
  const reducedDocs = splitDocs.map(doc => {
    const reducedMetadata = { ...doc.metadata };
    delete reducedMetadata.pdf; // Remove the 'pdf' field
    return new Document({
      pageContent: doc.pageContent,
      metadata: reducedMetadata,
    });
});





 * */

export default async function handler(req, res) {
  if (req.method === "GET") {
    console.log("Uploading book");
    // Enter your code here
    /** STEP ONE: LOAD DOCUMENT */
    const bookPath =
      "/Users/shawnesquivel/GitHub/yt-script-generator/data/document_loaders/naval-ravikant-book.pdf";
    const loader = new PDFLoader(bookPath);

    const docs = await loader.load();

    if (docs.length === 0) {
      console.log("No documents found.");
      return;
    }

    const splitter = new CharacterTextSplitter({
      separator: " ",
      chunkSize: 250,
      chunkOverlap: 10,
    });

    const splitDocs = await splitter.splitDocuments(docs);

    // Reduce the size of the metadata for each document -- lots of useless pdf information
    const reducedDocs = splitDocs.map((doc) => {
      const reducedMetadata = { ...doc.metadata };
      delete reducedMetadata.pdf; // Remove the 'pdf' field
      return new Document({
        pageContent: doc.pageContent,
        metadata: reducedMetadata,
      });
    });

    // docs.forEach((doc) => {
    //   console.log(doc);
    // });

    // console.log(`Uploading documents to Pinecone: ${docs}`);

    console.log(docs[100]);
    console.log(splitDocs[100].metadata);
    console.log(reducedDocs[100].metadata);

    /** STEP TWO: UPLOAD TO DATABASE */

    const client = new PineconeClient();

    await client.init({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT,
    });

    const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

    await PineconeStore.fromDocuments(reducedDocs, new OpenAIEmbeddings(), {
      pineconeIndex,
    });

    console.log("Successfully uploaded to DB");
    // Modify output as needed
    return res.status(200).json({
      result: `Uploaded to Pinecone! Before splitting: ${docs.length}, After splitting: ${splitDocs.length}`,
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
