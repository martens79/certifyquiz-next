// ================================================================
// NEW FILE: src/lib/certs.ts
// Purpose: Shared types for certification list/detail payloads
// ----------------------------------------------------------------


export type Localized<T = string> = T | Record<string, T>;


export interface CertListItem {
slug: string;
title: Localized<string>;
imageUrl?: string | null;
level?: Localized<string> | null;
description?: Localized<string> | null;
}


export interface CertDetail extends CertListItem {
quizRoute?: string;
topics?: Array<{ id?: number | string; slug?: string; title: Localized<string> }>;
sections?: { topicsTitle?: Localized<string> };
ctaButton?: Localized<string>;
extraContent?: {
learn?: { title?: Localized<string>; items?: Localized<string[]> };
whyChoose?: { title?: Localized<string>; items?: Localized<string[]> };
faq?: { title?: Localized<string>; items?: Localized<Array<{ q: string; a: string }>> };
};
seo?: {
title?: Localized<string>;
description?: Localized<string>;
};
}