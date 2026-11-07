// /go-rt = /go for the retargeting ad (default token meta_rt), on its own path so its taps are counted apart.
import { go } from './go.js';
export const onRequest = (ctx) => go(ctx, '/go-rt', 'meta_rt');
