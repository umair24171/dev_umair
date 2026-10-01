import crypto from 'node:crypto';
import { OpsError } from './core';
export const scheduledJobs = ['public-requests', 'follow-up-review', 'seo-plan'] as const;
export type ScheduledJob = typeof scheduledJobs[number];
export function runnerAuthorized(request: Request, secret = process.env.OPS_RUNNER_SECRET) {
    const supplied = request.headers.get('authorization') || '';
    if (!secret || !/^[a-f0-9]{64}$/.test(secret)) return false;
    const expected = `Bearer ${secret}`;
    return supplied.length === expected.length && crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));
}
export function scheduledJob(value: unknown): ScheduledJob {
    if (!scheduledJobs.includes(value as ScheduledJob)) throw new OpsError('Only approved draft-only jobs are permitted.', 403);
    return value as ScheduledJob;
}
export function pakistanWindow(date = new Date()) {
    return new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Karachi',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
}
export function firstBusinessDay(date = new Date()) {
    const local = pakistanWindow(date), [year, month, day] = local.split('-').map(Number);
    const current = new Date(Date.UTC(year, month - 1, day));
    if (current.getUTCDay() === 0 || current.getUTCDay() === 6) return false;
    for (let earlier = 1; earlier < day; earlier++) {
        const weekday = new Date(Date.UTC(year, month - 1, earlier)).getUTCDay();
        if (weekday !== 0 && weekday !== 6) return false;
    }
    return true;
}
export type SearchSnapshot = {csv:string;range:string;importedAt:string};
export function freshSnapshot(saved: SearchSnapshot | undefined, now = Date.now()) {
    const age = saved ? now - Date.parse(saved.importedAt) : NaN;
    return !!saved && !!saved.csv && !!saved.range && Number.isFinite(age) && age >= 0 && age <= 7 * 86400000;
}
