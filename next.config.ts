import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // ─── Flutter vs React Native duplicates → canonical ───
      // Picked flutter-vs-react-native-ai-app-2026-pick-the-right-stack as canonical
      // (shortest URL, cleanest title once we update its frontmatter).
      // All three dupes 301 to it. Google will consolidate ranking signals.
      {
        source: '/blog/flutter-vs-react-native-ai-apps-my-2026-take',
        destination: '/blog/flutter-vs-react-native-ai-app-2026-pick-the-right-stack',
        permanent: true,
      },
      {
        source: '/blog/flutter-vs-native-ai-apps-2026-pick-right-save-millions',
        destination: '/blog/flutter-vs-react-native-ai-app-2026-pick-the-right-stack',
        permanent: true,
      },
      {
        source: '/blog/flutter-vs-react-native-for-saas-2026-stack-choice',
        destination: '/blog/flutter-vs-react-native-ai-app-2026-pick-the-right-stack',
        permanent: true,
      },

      // ─── Old Flutter cost post → current one ───
      // If you delete flutter-app-cost-2026-my-freelancer-breakdown.md, uncomment:
      // {
      //   source: '/blog/flutter-app-cost-2026-my-freelancer-breakdown',
      //   destination: '/blog/flutter-ai-app-cost-2026-the-real-numbers',
      //   permanent: true,
      // },
    ];
  },
};

export default nextConfig;