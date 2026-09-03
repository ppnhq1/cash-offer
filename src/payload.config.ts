import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Locations } from './collections/Locations'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Business } from './Business/config'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const trustedOrigins = [
  getServerSideURL(),
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
].filter((origin): origin is string => Boolean(origin))

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  collections: [Pages, Posts, Locations, Media, Categories, Users],
  // Vercel sets VERCEL_URL to the unique origin of the current deployment
  // (preview or production), which differs from NEXT_PUBLIC_SERVER_URL (the
  // stable production domain) on every preview deployment. Without it here,
  // admin panel writes from a preview deployment get silently rejected: the
  // request's Origin header won't match the allow-list, so Payload drops the
  // auth cookie and every write fails access control as if logged out.
  cors: trustedOrigins,
  // An empty csrf list (Payload's default when unset) disables CSRF
  // checking entirely, not the other way around — it must be explicitly
  // scoped to this site's own origin(s) to actually enforce anything.
  csrf: trustedOrigins,
  globals: [Header, Footer, Business],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
