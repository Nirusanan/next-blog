import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
// import { compare } from 'bcryptjs';

const clientPromise = MongoClient.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const findUser = async (email) => {
  const client = await clientPromise;
  const db = client.db();
  return db.collection('users').findOne({ email });
};

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const client = await clientPromise;
        const db = client.db('blog_mongodb');
        const user = await db.collection('users').findOne({ email: credentials.email });

        if (!user) {
          throw new Error("Email not found");
        }

        // const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (credentials.password != user.password) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id,
          email: user.email,
        };

        // if (user && credentials.password == user.password) {
        //   return { id: user._id, email: user.email };
        // }
        // return null;
      },
    }),
  ],
 
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };