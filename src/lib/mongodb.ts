// MongoDB Connection Config for Skokka

export const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://admin:@cluster0.xxxxx.mongodb.net/skokka?retryWrites=true&w=majority&appName=Cluster0";

export async function getMongoDbUri(): Promise<string> {
  return MONGODB_URI;
}
