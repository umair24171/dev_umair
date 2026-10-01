import configuration from '@/content/business/operations-schedules.json';
import {body, failure} from '@/lib/ops/auth';
import {command, OpsError} from '@/lib/ops/core';
import {editorialPlan, researchJob} from '@/lib/ops/jobs';
import {transaction} from '@/lib/ops/store';
import {runnerAuthorized, scheduledJob, pakistanWindow} from '@/lib/ops/schedules';
export const runtime = 'nodejs';
export const maxDuration = 120;
export async function POST(request: Request) {
    try {
        if (!runnerAuthorized(request)) throw new OpsError('Scheduled runner authentication required.', 401);
        const input = await body(request), job = scheduledJob(input.job);
        if (process.env.OPS_JOBS_ENABLED !== 'true' || !configuration.enabled || !configuration.jobs.find(j=>j.id===job)?.enabled)
            throw new OpsError('Recurring operations are disabled.', 503);
        const key = `scheduled-${job}-${pakistanWindow()}`;
        const result = job === 'public-requests' ? await researchJob(key) : job === 'seo-plan' ? await editorialPlan({useSavedSearchConsole:true},key) : await transaction(s=>command(s,'prepare-due-follow-ups',{excludeSamples:true},key,'scheduler'));
        return Response.json({ok:true,job,result},{headers:{'Cache-Control':'no-store'}});
    } catch (e) {return failure(e);}
}
