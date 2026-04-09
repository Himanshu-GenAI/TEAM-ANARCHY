import mongoose from 'mongoose';
import dns from 'dns';

// Force Google DNS — system DNS can't resolve Atlas SRV records
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const connectDB = async (retries = 20, delayMs = 10000) => {
  for (let i = 1; i <= retries; i++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`⏳ MongoDB attempt ${i}/${retries} failed: ${error.message}`);
      if (i < retries) {
        console.log(`   Retrying in ${delayMs / 1000}s...`);
        await new Promise((r) => setTimeout(r, delayMs));
      } else {
        console.error('❌ Could not connect to MongoDB after all retries. Server will still run without DB.');
      }
    }
  }
};

export default connectDB;
