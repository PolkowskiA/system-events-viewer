import { tw } from "../lib/tw";

export const appMain = tw`mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-6 py-12`;

export const headerRoot = tw`flex flex-col justify-between gap-6 sm:flex-row sm:items-start`;
export const headerIntro = tw`w-full`;
export const headerKicker = tw`text-muted mb-3 text-xs tracking-[0.24em] uppercase`;
export const headerTitle = tw`text-ink mb-3 text-[clamp(2rem,3vw,3rem)]`;
export const headerSubtitle = tw`text-muted max-w-130`;
export const headerPanel = tw`shadow-small border-border grid min-w-70 gap-4 rounded-xl border bg-white px-6 py-5`;
export const headerPanelLabel = tw`text-muted mb-2 text-xs tracking-[0.16em] uppercase`;
export const headerPanelValue = tw`text-2xl font-semibold`;
export const headerPanelText = tw`text-muted`;
