export type CommunityPost = {
  name: string
  handle: string
  avatar: string
  href: string
  summary: string
}

// Summaries of posts featured on expo.dev; these are not verbatim quotations.
const imageRoot = 'https://cdn.sanity.io/images/9r24npb8/production/'
const avatar = (file: string) => `${imageRoot}${file}?auto=format&fit=max&q=75&w=96`

export const communityPosts: CommunityPost[] = [
  {
    name: 'Peter Piekarczyk', handle: '@peterpme',
    avatar: avatar('fc0fb70dcbb17181f7cae6deb47388a56f31dc45-400x400.jpg'),
    href: 'https://x.com/peterpme/status/1946019090679603318',
    summary: 'Shares his enthusiasm for Expo.',
  },
  {
    name: 'NicoDevs', handle: '@Nico_Devs',
    avatar: avatar('2107c732c719236f0918d45face1c71ca1095730-400x400.jpg'),
    href: 'https://x.com/Nico_Devs/status/1960268219626684768',
    summary: 'Highlights easier development, modest hardware requirements and the available libraries.',
  },
  {
    name: 'Nana Asante', handle: '@asantenocturnal',
    avatar: avatar('63a709502747c404e4b9fce20be099590d04f902-400x400.jpg'),
    href: 'https://x.com/asantenocturnal/status/1951825001528586485',
    summary: 'Expresses appreciation for Expo.',
  },
  {
    name: 'Antonin marchard', handle: '@antomarchard',
    avatar: avatar('184101ef2f04fd522c15ab2b6b490c063f29cca5-400x400.jpg'),
    href: 'https://x.com/antomarchard/status/1966106620662005835',
    summary: 'Growing enthusiasm for React Native and Expo.',
  },
  {
    name: 'Adrian Carolli', handle: '@icookandcode',
    avatar: avatar('ecbc5f6a58b39b20ee300aef2cb246dc8d2c3c73-400x400.jpg'),
    href: 'https://x.com/icookandcode/status/1956161800233476513',
    summary: 'Credits Expo with making development easier.',
  },
  {
    name: 'Simon Grimm', handle: '@schlimmson',
    avatar: avatar('4317219ac0c1f192d953db4954ff03c3cdb07aae-400x400.jpg'),
    href: 'https://x.com/schlimmson/status/1963964589462389206',
    summary: 'Describes API routes as central to his React Native projects.',
  },
  {
    name: 'Hugo Duarte', handle: '@hugoasduarte',
    avatar: avatar('4adfa8ab563a335855c8b5010d5c969c87c91ee8-400x400.jpg'),
    href: 'https://x.com/hugoasduarte/status/1831618467365007777',
    summary: 'Resolved an upgrade struggle by moving into a fresh Expo project.',
  },
  {
    name: 'devon', handle: '@devon_94',
    avatar: avatar('090228df12a8c97a6c7749872ed6517768969174-400x400.jpg'),
    href: 'https://x.com/devon_94/status/1680432340818972672',
    summary: 'Recommends Expo to other developers.',
  },
  {
    name: 'JD Conley', handle: '@wackie',
    avatar: avatar('8a834edec04afcae5892bb0f3adb37d295343c48-400x400.jpg'),
    href: 'https://x.com/wackie/status/1967618703492796886',
    summary: 'Prefers its development environment, flexibility and improved documentation.',
  },
  {
    name: 'Melih Yumak', handle: '@hadnazzar',
    avatar: avatar('004ccb1060989167eb35f022b9f7d01ac8c172af-400x400.jpg'),
    href: 'https://x.com/hadnazzar/status/1783636614389895305',
    summary: 'Values shared code, ready-made components and over-the-air delivery.',
  },
  {
    name: ':) waally', handle: '@_mohawwal',
    avatar: avatar('b8e37a26e2c9f290cfca71718261d02cfb7da29f-399x399.jpg'),
    href: 'https://x.com/_mohawwal/status/1872583592326697391',
    summary: 'Enjoys the Expo and React Native combination.',
  },
  {
    name: 'Josh Gonsalves', handle: '@joshgonsalves_',
    avatar: avatar('e59b055582a87aa6e1fed8ac3ccf606cf1350e32-400x400.jpg'),
    href: 'https://x.com/joshgonsalves_/status/1966582778088022426',
    summary: 'Adds his support for Expo.',
  },
  {
    name: 'miaugladiator11', handle: '@miaugladiator1',
    avatar: avatar('c6ec8fa33ced18d203ff1e872c3a33f56276c29c-400x400.jpg'),
    href: 'https://x.com/miaugladiator1/status/1944470251996877226',
    summary: 'Recommends choosing Expo.',
  },
  {
    name: 'Dane Grant', handle: '@danecando',
    avatar: avatar('0616f054ebf66def4b5e7eb25fac2d3aedac31dd-400x400.jpg'),
    href: 'https://x.com/danecando/status/1907422266415046771',
    summary: 'Praises Expo.',
  },
  {
    name: 'getDerivedSwaggerFromHacker', handle: '@hackerswagger',
    avatar: avatar('7f31b0e4e6fadd2c8dcf1c5426828401a43942b5-400x400.png'),
    href: 'https://x.com/hackerswagger/status/1963634603148898693',
    summary: 'Describes enterprise development progress using Expo CNG.',
  },
  {
    name: 'Prince Ajuzie', handle: '@princeajuzie7',
    avatar: avatar('159691c1af9aa380b65115e8e68027a16cae0f58-400x400.jpg'),
    href: 'https://x.com/princeajuzie7/status/1950473034927648849',
    summary: 'Supports React Native with Expo.',
  },
  {
    name: 'Patrick Aljord', handle: '@patcito',
    avatar: avatar('3315bc9b2fea5d7939384253b8cd490959d98826-400x400.jpg'),
    href: 'https://x.com/patcito/status/1966855889501253894',
    summary: 'Suggests using Expo.',
  },
]
